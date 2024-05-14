import Joi from "joi";

import { updateUser } from "@/server/db/users";
import { getSessionUser, getValidatedInput } from "@/server/utils/request";
import type { UpdateUserPayload } from "@/types/user";
import { setupTokens } from "@/server/utils/token";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<UpdateUserPayload>(event, {
    name: Joi.string().required().messages({ "strings.empty": "errors.empty" }),

    slug: Joi.string().required().messages({ "strings.empty": "errors.empty" }),

    bio: Joi.string().optional().allow(null),

    contacts: Joi.array()
      .items(
        Joi.object().keys({
          type: Joi.string().valid("phone", "other", "email").required(),
          contact: Joi.string().min(5).max(264).required(),
        }),
      )
      .required()
      .min(1)
      .messages({
        "array.min": "errors.empty",
        "any.required": "errors.invalidContact",
        "any.only": "errors.invalidContactType",
      }),
  });

  const id = getRouterParam(event, "id") as string;
  const user = getSessionUser(event);

  console.log(user);

  if (!user || user.id !== id) {
    setResponseStatus(event, 401);
    sendError(event, createError({ statusCode: 401, statusMessage: "errors.unexpected" }));
    return;
  }

  try {
    const updatedUser = await updateUser(body, user.id);

    if (!updatedUser) {
      sendError(event, createError({ statusCode: 500, statusMessage: "errors.unexpected" }));
      return;
    }

    return updatedUser;
  } catch (err: any) {
    if (err.statusCode === 401) {
      throw createError({ statusCode: 401, statusMessage: "errors.unexpected" });
    }

    useBugsnag().notify({
      name: "[user] couldnt update user",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
