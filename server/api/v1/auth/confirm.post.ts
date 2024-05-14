import Joi from "joi";

import { verifyUser } from "@/server/db/users";
import { getValidatedInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<{ token: string }>(event, {
    token: Joi.string().required().min(1).max(255).messages({
      "string.empty": "errors.invalidConfirmToken",
      "string.max": "errors.invalidConfirmToken",
      "string.min": "errors.invalidConfirmToken",
    }),
  });

  try {
    if (await verifyUser(body.token)) {
      return { success: true };
    }
  } catch (error) {
    throw createError(error as any);
  }
});
