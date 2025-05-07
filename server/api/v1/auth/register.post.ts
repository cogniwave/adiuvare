import { addUser } from "server/db/users";
import { sendEmail } from "server/services/brevo";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { notifyNewUser } from "server/services/slack";
import { subscribeToNewsletter, type NewsletterType } from "server/services/brevo";
import Joi, { RequiredEmail, RequiredPassword, RequiredString } from "shared/validators";
import type { BaseUser, User, UserType } from "shared/types/user";
import type { TranslationFunction } from "shared/types";
import { log } from "server/utils/logger";

const register = async (payload: BaseUser, t: TranslationFunction): Promise<User> => {
  const token = `${genToken(32)}${Date.now()}`;
  const newUser = await addUser(payload, token);

  if (!newUser) {
    throw Error("Something went wrong");
  }

  await sendEmail(
    t("email.accountConfirm.subject"),
    { email: payload.email, name: payload.name },
    "userActionRequired",
    {
      greetings: t("email.greetings"),
      name: payload.name,
      body: t("email.accountConfirm.body"),
      body2: t("email.accountConfirm.body2"),
      buttonText: t("email.accountConfirm.buttonText"),
      alternativeLinkText: t("email.alternativeLinkText"),
      link: `${process.env.APP_BASE_URL}/confirmation?token=${token}&email=${payload.email}`,
    },
  );

  return newUser;
};

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<BaseUser>(event, {
    name: RequiredString.max(255),
    password: RequiredPassword,
    email: RequiredEmail,
    type: RequiredString.valid("org", "volunteer"),
    newsletter: Joi.boolean().default(false),
  });

  const email = sanitizeInput(body.email);

  try {
    const user = await register(
      {
        name: sanitizeInput(body.name),
        password: body.password,
        type: sanitizeInput<UserType>(body.type),
        email,
      },
      t,
    );

    if (body.newsletter) {
      const newsletters: NewsletterType[] = ["newsletter"];

      if (body.type === "org") {
        newsletters.push("orgNewsletter");
      }

      await subscribeToNewsletter(email, newsletters);
    }

    await notifyNewUser(user);

    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes("UNIQUE constraint")) {
        throw createError({
          data: {
            email: t("errors.emailExists"),
          },
          statusCode: 422,
          statusMessage: t("errors.validationError"),
        });
      }

      log("[user] couldn't create user", JSON.stringify(err.message));
    }

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
