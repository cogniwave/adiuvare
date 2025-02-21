import Joi from "joi";

import { addUser } from "~~/server/db/users";
import { sendEmail } from "~~/server/services/brevo";
import { sanitizeInput, getValidatedInput } from "~~/server/utils/request";
import { notifyNewUser } from "~~/server/services/slack";
import { subscribeToNewsletter, type NewsletterType } from "~~/server/services/brevo";

import { isDrizzleError } from "~~/shared/types/guards";
import type { BaseUser, User, UserType } from "~~/shared/types/user";
import type { TranslationFunction } from "~~/shared/types";

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
    name: Joi.string()
      .required()
      .max(255)
      .messages({
        "string.empty": t("errors.empty"),
        "string.max": t("errors.max", 255),
      }),

    password: Joi.string()
      .required()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
      .messages({
        "string.empty": t("errors.empty"),
        "string.pattern.base": t("errors.invalidPassword"),
      }),

    email: Joi.string()
      .required()
      .email({})
      .messages({
        "string.empty": t("errors.empty"),
        "string.max": t("errors.max", 255),
        "string.email": t("errors.invalidEmail"),
      }),

    type: Joi.string()
      .required()
      .valid("org", "volunteer")
      .messages({
        "string.empty": t("errors.empty"),
        "any.only": t("errors.invalidUserType"),
      }),

    newsletter: Joi.boolean().default(false),
  });

  const email = sanitizeInput(body.email);

  try {
    const user = await register(
      {
        name: sanitizeInput(body.name),
        password: sanitizeInput(body.password),
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
    // todo: validate this is still correct
    if (isDrizzleError(err) && err.message === "users_email_unique") {
      throw createError({
        data: {
          email: t("errors.emailExists"),
        },
        statusCode: 422,
        statusMessage: t("errors.validationError"),
      });
    }

    console.log(err);
    useBugsnag().notify({
      name: "[user] couldn't create user",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
