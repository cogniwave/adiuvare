import { updateUser } from "server/database/users";
import { validateEvent } from "server/utils/request";
import { translate } from "server/utils/i18n";

import type { UpdateAccountPayload } from "shared/types/user";
import { updateAccountSchema } from "shared/schemas/user.schema";

export default defineProtectedRouteHandler(async (event) => {
  try {
    const body = await validateEvent<UpdateAccountPayload>(event, updateAccountSchema);

    await updateUser(event.context.user.id, body);

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith("duplicate key")) {
      throw createError({
        statusCode: 422,
        statusMessage: translate("errors.validationError"),
        data: { email: translate("errors.emailExists") },
      });
    }

    throw err;
  }
});
