import Joi from "joi";

import { verifyUser } from "@/server/db/users";
import { getValidatedInput, sanitizeInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<{ token: string }>(event, {
    token: Joi.string()
      .required()
      .min(1)
      .max(255)
      .messages({
        "string.empty": t("errors.invalidConfirmToken"),
        "string.max": t("errors.invalidConfirmToken"),
        "string.min": t("errors.invalidConfirmToken"),
      }),
  });

  try {
    if (await verifyUser(sanitizeInput(body.token))) {
      return { success: true };
    }
  } catch (error) {
    throw createError(error as any);
  }
});
