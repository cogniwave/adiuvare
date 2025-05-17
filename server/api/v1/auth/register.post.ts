import { addUser } from "server/db/users";
import { sendEmail } from "server/services/brevo";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { notifyNewUser } from "server/services/slack";
import { subscribeToNewsletter, type NewsletterType } from "server/services/brevo";
import Joi, { RequiredEmail, RequiredPassword, RequiredString } from "shared/validators";
import type { BaseUser, User, UserType } from "shared/types/user";
import { translate } from "server/utils/i18n";
import { log } from "server/utils/logger";

const register = async (payload: BaseUser): Promise<User> => {
  const token = `${genToken(32)}${Date.now()}`;
  const newUser = await addUser(payload, token);

  if (!newUser) {
    throw Error("Something went wrong");
  }

  await sendEmail(
    translate("email.accountConfirm.subject"),
    { email: payload.email, name: payload.name },
    "userActionRequired",
    {
      greetings: translate("email.greetings"),
      name: payload.name,
      body: translate("email.accountConfirm.body"),
      body2: translate("email.accountConfirm.body2"),
      buttonText: translate("email.accountConfirm.buttonText"),
      alternativeLinkText: translate("email.alternativeLinkText"),
      link: `${process.env.APP_BASE_URL}/confirmation?token=${token}&email=${payload.email}`,
    },
  );

  return newUser;
};

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<BaseUser>(event, {
    name: RequiredString.max(255),
    password: RequiredPassword,
    email: RequiredEmail,
    type: RequiredString.valid("org", "volunteer"),
    newsletter: Joi.boolean().default(false),
  });

  const email = sanitizeInput(body.email);

  try {
    const user = await register({
      name: sanitizeInput(body.name),
      password: body.password,
      type: sanitizeInput<UserType>(body.type),
      email,
    });

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
            email: translate("errors.emailExists"),
          },
          statusCode: 422,
          statusMessage: translate("errors.validationError"),
        });
      }

      log("[user] couldn't create user", JSON.stringify(err.message));
    }

    throw createError({
      statusCode: 500,
      statusMessage: translate("errors.unexpected"),
    });
  }
});
