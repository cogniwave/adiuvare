import Joi from "joi";

import { POST_NEEDS, POST_STATES } from "@/server/db/schemas/posts.schema";
import { updatePost } from "@/server/db/posts";
import { getSessionUser, getValidatedInput, sanitizeInput } from "@/server/utils/request";
import type { UpdatePostPayload } from "@/types/post";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<UpdatePostPayload>(event, {
    title: Joi.string().required().messages({ "strings.empty": "errors.empty" }),

    state: Joi.string()
      .required()
      .valid(...POST_STATES)
      .messages({
        "strings.empty": "errors.empty",
        "strings.valid": "errors.invalidField",
      }),

    description: Joi.string().required().messages({ "strings.empty": "errors.empty" }),

    needs: Joi.array()
      .items(Joi.string().valid(...POST_NEEDS))
      .required()
      .messages({
        "strings.empty": "errors.empty",
        "strings.valid": "errors.invalidField",
      }),

    locations: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "strings.empty": "errors.empty" }),

    schedule: Joi.object().required().messages({ "strings.empty": "errors.empty" }),

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

  const slug = sanitizeInput(getRouterParam(event, "slug"));
  const user = getSessionUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    sendError(event, createError({ statusCode: 401, statusMessage: "errors.unexpected" }));
    return;
  }

  try {
    const scheduleType = sanitizeInput(body.schedule.type);

    const result = await updatePost(
      slug,
      {
        title: sanitizeInput(body.title),
        description: sanitizeInput(body.description),
        state: sanitizeInput(body.state),
        needs: body.needs.map((n) => sanitizeInput(n)),
        locations: body.locations.map((l) => sanitizeInput(l)),
        schedule: {
          type: scheduleType,
          ...(scheduleType !== "anytime" && { payload: body.schedule.payload }),
        },
        contacts: body.contacts.map((c) => ({ type: c.type, contact: sanitizeInput(c.contact) })),
      },
      user.id,
    );

    if (result) {
      return result;
    }

    sendError(event, createError({ statusCode: 500, statusMessage: "errors.unexpected" }));
  } catch (err: any) {
    if (err.statusCode === 401) {
      throw createError({ statusCode: 401, statusMessage: "errors.unexpected" });
    }

    useBugsnag().notify({
      name: "[post] couldnt delete post",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
