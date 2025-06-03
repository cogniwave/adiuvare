import type { H3Event, EventHandlerRequest } from "h3";

import { updateUser } from "server/database/users";
import { getValidatedInput } from "server/utils/request";
import { translate } from "server/utils/i18n";

import type { UpdateProfilePayload, UpdateAccountPayload } from "shared/types/user";
import { isH3Error } from "shared/types/guards";
import { updateProfileSchema, updateAccountSchema } from "shared/schemas/user";

// todo: split this into 2 different endpoints, PATCH users/{id}/account & PATCH users/{id}/profile
type UpdateAction = "account" | "profile";

const updateProfile = async (userId: string, event: H3Event<EventHandlerRequest>) => {
  const body = await getValidatedInput<UpdateProfilePayload>(event, updateProfileSchema);

  await updateUser(userId, body);

  return body;
};

const updateAccount = async (userId: string, event: H3Event<EventHandlerRequest>) => {
  const body = await getValidatedInput<UpdateAccountPayload>(event, updateAccountSchema);

  await updateUser(userId, body);

  return body.email;
};

export default defineProtectedRouteHandler(async (event) => {
  const action: UpdateAction | undefined = getQuery(event)?.action as UpdateAction;

  if (!["account", "profile"].includes(action)) {
    setResponseStatus(event, 500);
    sendError(event, createError({ statusCode: 500, statusMessage: "Internal Server Error" }));
    return;
  }

  try {
    if (action === "profile") {
      return await updateProfile(event.context.user.id, event);
    }

    await updateAccount(event.context.user.id, event);

    return { success: true };
  } catch (err: unknown) {
    if (isH3Error(err)) {
      if (err.statusCode === 422) {
        throw createError(err);
      }

      if (err.message.startsWith("duplicate key")) {
        throw createError({
          statusCode: 422,
          statusMessage: translate("errors.validationError"),
          data: { email: translate("errors.emailExists") },
        });
      }
    }
  }
});
