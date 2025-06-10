import { z } from "zod/v4";
import { getValidatedInput } from "server/utils/request";
import { subscribeToNewsletter } from "server/services/brevo";

import { emailSchema } from "shared/schemas/common.schema";

const schema = z.object({ email: emailSchema });

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<z.infer<typeof schema>>(event, schema);

  // validate and add token to event
  subscribeToNewsletter(body.email);

  return { success: true };
});
