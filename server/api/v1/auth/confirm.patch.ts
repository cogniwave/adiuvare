import Joi from "joi";
import type { H3Error } from "h3";

import { verifyUser } from "@/server/db/users";
import { getValidatedInput, sanitizeInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<{ email: string; token: string }>(event, {
    token: Joi.string()
      .required()
      .min(32)
      .max(50)
      .messages({
        "string.empty": t("errors.invalidConfirmToken"),
        "string.max": t("errors.invalidConfirmToken"),
        "string.min": t("errors.invalidConfirmToken"),
      }),

    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": t("errors.empty"),
        "string.max": t("errors.max", 255),
        "string.email": t("errors.invalidEmail"),
      }),
  });

  // todo: add validation for link expiration

  try {
    return {
      success: await verifyUser(sanitizeInput(body.token), sanitizeInput(body.email)),
    };
  } catch (error: unknown) {
    throw createError(error as H3Error);
  }
});
