import type { H3Event, EventHandlerRequest } from "h3";

import { updateUser } from "server/database/users";
import { getValidatedInput } from "server/utils/request";
import { translate } from "server/utils/i18n";
import { log } from "server/utils/logger";

import { OptionalEmail, OptionalPassword, OptionalString, RequiredContacts, RequiredString } from "shared/validators";
import type { UpdateProfilePayload, UpdateAccountPayload } from "shared/types/user";
import { isH3Error } from "shared/types/guards";

type UpdateAction = "account" | "profile";

const updateProfile = async (userId: string, event: H3Event<EventHandlerRequest>) => {
  const body = await getValidatedInput<UpdateProfilePayload>(event, {
    name: RequiredString,
    slug: RequiredString,
    bio: OptionalString,
    website: OptionalString.max(256),
    address: OptionalString.max(256),
    postalCode: OptionalString.max(8),
    city: OptionalString.max(256),
    district: OptionalString.max(128),
    contacts: RequiredContacts,
  });

  await updateUser(userId, body);

  return body;
};

const updateAccount = async (userId: string, event: H3Event<EventHandlerRequest>) => {
  const body = await getValidatedInput<UpdateAccountPayload>(event, {
    email: OptionalEmail,
    password: OptionalPassword,
  });

  await updateUser(userId, body);

  return body.email;
};

export default defineProtectedRouteHandler(async (event) => {
  const action: UpdateAction | undefined = getQuery(event)?.action as UpdateAction;

  if (!["account", "profile"].includes(action)) {
    setResponseStatus(event, 500);
    sendError(event, createError({ statusCode: 500, statusMessage: translate("errors.unexpected") }));
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

    log("[user] couldn't update user", JSON.stringify(err));

    throw err;
  }
});
