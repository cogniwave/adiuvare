import { updateUser } from "server/database/users";
import { validateEvent } from "server/utils/request";

import type { UpdateProfilePayload } from "shared/types/user";
import { updateProfileSchema } from "shared/schemas/user.schema";

export default defineProtectedRouteHandler(async (event) => {
  const body = await validateEvent<UpdateProfilePayload>(event, updateProfileSchema);

  await updateUser(event.context.user.id, body);

  return body;
});
