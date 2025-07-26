import { z } from "zod/v4";
import { validateEvent } from "server/utils/request";
import { subscribeToNewsletter } from "server/services/brevo";

import { emailSchema } from "shared/schemas/common.schema";

const schema = z.object({ email: emailSchema });

export default defineWrappedResponseHandler(async (event) => {
  const body = await validateEvent<z.infer<typeof schema>>(event, schema);

  // validate and add token to event
  subscribeToNewsletter(body.email);

  return { success: true };
});
