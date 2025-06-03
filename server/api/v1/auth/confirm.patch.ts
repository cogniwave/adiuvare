import { z } from "zod/v4";

import { verifyUser } from "server/database/users";
import { getValidatedInput, sanitizeInput } from "server/utils/request";

import { tokenSchema } from "shared/validators";
import { translate } from "server/utils/i18n";

const schema = z.object({
  token: tokenSchema,
  email: z.email().transform(sanitizeInput),
});

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<z.infer<typeof schema>>(event, schema);

  // todo: add validation for link expiration
  if (await verifyUser(body.token, body.email)) {
    setResponseStatus(event, 204);
    return;
  }

  throw createError({
    statusCode: 422,
    statusMessage: "Unprocessable Content",
    data: { token: translate("errors.invalidConfirmToken") },
  });
});
