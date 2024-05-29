import Joi from "joi";

import { addUser } from "@/server/db/users";
import { sendEmail } from "@/server/services/mail";
import { sanitizeInput, getValidatedInput } from "@/server/utils/request";
import { notifyNewUser } from "@/server/services/slack";

import type { BaseUser, User } from "@/types/user";
import type { DrizzleError } from "@/server/types/drizzle";
import type { TranslationFunction } from "@/types";

const register = async (payload: BaseUser, t: TranslationFunction): Promise<User> => {
  try {
    const token = `${genToken(32)}${Date.now()}`;
    const newUser = await addUser(payload, token);

    if (!newUser) {
      throw Error("Something went wrong");
    }

    sendEmail(
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
  } catch (err: unknown) {
    if ((err as DrizzleError).constraint === "users_email_unique") {
      throw createError({
        data: {
          email: t("errors.emailExists"),
        },
        statusCode: 422,
        statusMessage: t("errors.validationError"),
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
};

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<BaseUser>(event, {
    name: Joi.string()
      .required()
      .max(255)
      .messages({
        "string.empty": t("errors.empty"),
        "string.max": t("errors.max_255"),
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
        "string.max": t("errors.max_255"),
        "string.email": t("errors.invalidEmail"),
      }),

    type: Joi.string()
      .required()
      .valid("org", "volunteer")
      .messages({
        "string.empty": t("errors.empty"),
        "any.only": t("errors.invalidUserType"),
      }),
  });

  const user = await register(
    {
      name: sanitizeInput(body.name),
      password: sanitizeInput(body.password),
      type: sanitizeInput(body.type),
      email: sanitizeInput(body.email),
    },
    t,
  );

  notifyNewUser(user);

  return user;
});
