import type { H3Error } from "h3";

import { verifyUser } from "server/db/users";
import { getValidatedInput, sanitizeInput } from "server/utils/request";
import { translate } from "server/utils/i18n";

import { RequiredEmail, RequiredString } from "shared/validators";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<{ email: string; token: string }>(event, {
    token: RequiredString.min(32)
      .max(50)
      .messages({
        "string.empty": translate("errors.invalidConfirmToken"),
        "string.max": translate("errors.invalidConfirmToken"),
        "string.min": translate("errors.invalidConfirmToken"),
      }),

    email: RequiredEmail,
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
