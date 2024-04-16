import Joi from "joi";

import { POST_NEEDS, POST_STATES } from "~/server/db/schemas/posts";
import { updatePost } from "~/server/db/posts";
import { getSessionUser, getValidatedInput } from "~/server/utils/request";
import { UpdatePostPayload } from "~/types/post";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<UpdatePostPayload>(event, {
    title: Joi.string().required().messages({ "strings.empty": "errors.empty" }),

    state: Joi.string().required().valid(POST_STATES).messages({
      "strings.empty": "errors.empty",
      "strings.valid": "errors.invalidField",
    }),

    description: Joi.string().required().messages({ "strings.empty": "errors.empty" }),

    needs: Joi.array().items(Joi.string().valid(POST_NEEDS)).required().messages({
      "strings.empty": "errors.empty",
      "strings.valid": "errors.invalidField",
    }),

    locations: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "strings.empty": "errors.empty" }),

    schedule: Joi.object().required().messages({ "strings.empty": "errors.empty" }),
  });

  const postId = getRouterParam(event, "id") as string;

  try {
    const user = await getSessionUser(event);

    return await updatePost(postId, body, user.id);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[post] couldnt delete post",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
