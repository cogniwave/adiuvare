import Joi from "joi";

import { updateUser } from "@/server/db/users";
import { getSessionUser, getValidatedInput, sanitizeInput } from "@/server/utils/request";

import type { H3Event, EventHandlerRequest } from "h3";
import type { UpdateProfilePayload, UpdateAccountPayload } from "@/types/user";
import type { TranslationFunction } from "@/types";

type UpdateAction = "account" | "profile";

const updateProfile = async (
  userId: string,
  event: H3Event<EventHandlerRequest>,
  t: TranslationFunction,
) => {
  const body = await getValidatedInput<UpdateProfilePayload>(event, {
    name: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),

    slug: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),

    bio: Joi.string().optional().allow(null, ""),

    contacts: Joi.array()
      .allow(null)
      .items(
        Joi.object().keys({
          type: Joi.string().valid("phone", "other", "email").required(),
          contact: Joi.string().min(5).max(264).required(),
        }),
      )
      .messages({
        "array.min": t("errors.empty"),
        "any.required": t("errors.invalidContact"),
        "any.only": t("errors.invalidContactType"),
      }),
  });

  const updatedUser = await updateUser(userId, [
    { field: "name", value: sanitizeInput(body.name) },
    { field: "slug", value: sanitizeInput(body.slug) },
    { field: "bio", value: sanitizeInput(body.bio) },
    {
      field: "contacts",
      value: body.contacts?.map((c) => ({ type: c.type, contact: sanitizeInput(c.contact) })),
    },
  ]);

  if (!updatedUser) {
    sendError(event, createError({ statusCode: 500, statusMessage: t("errors.unexpected") }));
    return;
  }

  return updatedUser;
};

const updateAccount = async (
  userId: string,
  event: H3Event<EventHandlerRequest>,
  t: TranslationFunction,
) => {
  const body = await getValidatedInput<UpdateAccountPayload>(event, {
    email: Joi.string()
      .email({})
      .messages({
        "string.max": t("errors.max", 255),
        "string.email": t("errors.invalidEmail"),
      }),

    password: Joi.string()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
      .messages({
        "string.pattern.base": t("errors.invalidPassword"),
      }),
  });

  const fields = [];

  if (body.email) {
    fields.push({ field: "email", value: sanitizeInput(body.email) });
  }

  if (body.password) {
    fields.push({ field: "password", value: sanitizeInput(body.password) });
  }

  await updateUser(userId, fields);

  return body.email;
};

export default defineEventHandler(async (event) => {
  const action: UpdateAction | undefined = getQuery(event)?.action as UpdateAction;

  const t = await useTranslation(event);

  if (!["account", "profile"].includes(action)) {
    setResponseStatus(event, 500);
    sendError(event, createError({ statusCode: 500, statusMessage: t("errors.unexpected") }));
    return;
  }

  const id = sanitizeInput(getRouterParam(event, "id"));
  const user = getSessionUser(event);

  if (!user || user.id !== id) {
    setResponseStatus(event, 401);
    sendError(event, createError({ statusCode: 401, statusMessage: t("errors.unexpected") }));
    return;
  }

  try {
    if (action === "profile") {
      return await updateProfile(user.id, event, t);
    }

    const email = await updateAccount(user.id, event, t);

    if (email) {
      return setupTokens(event, { ...user, email });
    }

    return { success: true };
  } catch (err: any) {
    if (err.statusCode === 401) {
      throw createError({ statusCode: 401, statusMessage: t("errors.unexpected") });
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

    console.log(err);
    useBugsnag().notify({
      name: "[user] couldnt update user",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
