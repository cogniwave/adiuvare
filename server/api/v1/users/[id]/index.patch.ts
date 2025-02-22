import type { H3Event, EventHandlerRequest } from "h3";

import { updateUser } from "server/db/users";
import { getValidatedInput, sanitizeInput } from "server/utils/request";

import {
  OptionalEmail,
  OptionalPassword,
  OptionalString,
  RequiredContacts,
  RequiredString,
} from "shared/joi/validators";
import type { UpdateProfilePayload, UpdateAccountPayload } from "shared/types/user";
import type { TranslationFunction } from "shared/types";
import { isH3Error } from "shared/types/guards";

type UpdateAction = "account" | "profile";

const updateProfile = async (userId: string, event: H3Event<EventHandlerRequest>, t: TranslationFunction) => {
  const body = await getValidatedInput<UpdateProfilePayload>(event, {
    name: RequiredString,
    slug: RequiredString,
    bio: OptionalString,
    website: OptionalString.max(256),
    address: OptionalString.max(256),
    postalcode: OptionalString.max(8),
    city: OptionalString.max(256),
    district: OptionalString.max(128),
    postalCode: OptionalString,
    contacts: RequiredContacts,
  });

  const updatedUser = await updateUser(userId, body);

  if (!updatedUser) {
    sendError(event, createError({ statusCode: 500, statusMessage: t("errors.unexpected") }));
    return;
  }

  return updatedUser;
};

const updateAccount = async (userId: string, event: H3Event<EventHandlerRequest>, t: TranslationFunction) => {
  const body = await getValidatedInput<UpdateAccountPayload>(event, {
    email: OptionalEmail,
    password: OptionalPassword,
  });

  await updateUser(userId, body);

  return body.email;
};

export default defineProtectedRouteHandler(async (event) => {
  const action: UpdateAction | undefined = getQuery(event)?.action as UpdateAction;

  const t = await useTranslation(event);

  if (!["account", "profile"].includes(action)) {
    setResponseStatus(event, 500);
    sendError(event, createError({ statusCode: 500, statusMessage: t("errors.unexpected") }));
    return;
  }

  const id = sanitizeInput(getRouterParam(event, "id") || "");

  if (event.context.user.id !== id) {
    setResponseStatus(event, 401);
    sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "unauthorized",
        message: t("errors.unauthenticated"),
      }),
    );
    return;
  }

  try {
    if (action === "profile") {
      return await updateProfile(event.context.user.id, event, t);
    }

    await updateAccount(event.context.user.id, event, t);

    return { success: true };
  } catch (err: unknown) {
    if (isH3Error(err)) {
      if (err.statusCode === 401) {
        throw createError({
          statusCode: 401,
          statusMessage: "unauthorized",
          message: t("errors.unauthenticated"),
        });
      }

      if (err.statusCode === 422) {
        throw createError(err);
      }

      if (err.message.startsWith("duplicate key")) {
        throw createError({
          statusCode: 422,
          statusMessage: t("errors.validationError"),
          data: { email: t("errors.emailExists") },
        });
      }
    }

    console.log(err);
    useBugsnag().notify({
      name: "[user] couldn't update user",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
