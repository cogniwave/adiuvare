import Joi from "joi";

import dayjs from "@/services/dayjs.service";
import { updatePassword } from "@/server/db/users";
import { getValidatedInput } from "@/server/utils/request";
import { sendEmail } from "~/server/services/mail";

// import type { PasswordUpdatePayload } from "@/types/user";

interface PasswordUpdatePayload {
  email: string;
  password: string;
  token: string;
}

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<PasswordUpdatePayload>(event, {
    password: Joi.string()
      .required()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
      .messages({
        "string.empty": "errors.empty",
        "string.pattern.base": "errors.invalidPassword",
      }),

    email: Joi.string().required().email({}).messages({
      "string.empty": "errors.empty",
      "string.max": "errors.max_255",
      "string.email": "errors.invalidEmail",
    }),

    token: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  if (dayjs(body.token.split("-")[1]).isAfter(dayjs().add(12, "hours"))) {
    const t = await useTranslation(event);

    throw createError({
      data: [t("errors.expiredResetLink")],
      message: "Invalid link",
      statusCode: 400,
    });
  }

  await updatePassword(
    sanitizeInput(body.email),
    sanitizeInput(body.password),
    sanitizeInput(body.token),
  );

  const t = await useTranslation(event);

  sendEmail(t("email.resetSuccess.subject"), { email: body.email }, "information", {
    body: t("email.resetSuccess.body"),
  });

  setResponseStatus(event, 200);
  return { success: true };
});
