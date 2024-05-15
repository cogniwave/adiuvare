import Joi from "joi";

import type { CreatePostPayload } from "@/types/post";
import { getSessionUser } from "@/server/utils/request";
import { POST_NEEDS } from "@/server/db/schemas/posts.schema";
import { createPost } from "@/server/db/posts";
import { getValidatedInput } from "@/server/utils/request";
import { genToken } from "@/server/utils";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<CreatePostPayload>(event, {
    title: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
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
  });

  // validate and add token to event
  try {
    const user = getSessionUser(event);

    if (!user) {
      setResponseStatus(event, 401);
      sendError(event, createError({ statusCode: 401, statusMessage: "errors.unexpected" }));
      return;
    }

    return await createPost({
      ...body,
      createdUserId: user.id,
      slug: `${body.title.trim().slice(0, 20).replaceAll(" ", "_")}-${genToken(10)}`,
    });
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "couldnt create post",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: "errors.unexpected",
    });
  }
});
