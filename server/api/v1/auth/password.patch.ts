import Joi from "joi";

import dayjs from "shared/services/dayjs.service";
import { updatePassword } from "server/db/users";
import { getValidatedInput } from "server/utils/request";
import { sendEmail } from "server/services/brevo";

// import type { PasswordUpdatePayload } from "app/types/user";

interface PasswordUpdatePayload {
  email: string;
  password: string;
  token: string;
}

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<PasswordUpdatePayload>(event, {
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

    token: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),
  });

  if (dayjs(body.token.split("-")[1]).isAfter(dayjs().add(12, "hours"))) {
    const t = await useTranslation(event);

    throw createError({
      data: [t("errors.expiredResetLink")],
      message: "Invalid link",
      statusCode: 400,
    });
  }

  await updatePassword(sanitizeInput(body.email), sanitizeInput(body.password), sanitizeInput(body.token));

  await sendEmail(t("email.resetSuccess.subject"), { email: body.email }, "information", {
    greetings: t("email.greetings"),
    body: t("email.resetSuccess.body"),
  });

  setResponseStatus(event, 200);
  return { success: true };
});
