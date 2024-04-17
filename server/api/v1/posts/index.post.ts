import Joi from "joi";

import type { CreatePostPayload } from "~/types/post";
import { POST_NEEDS } from "~/server/db/schemas/posts.schema";
import { createPost } from "~/server/db/posts";
import { getUser } from "~/server/db/users";
import { users } from "~/server/db/schemas/users.schema";
import { getValidatedInput } from "~/server/utils/request";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<CreatePostPayload>(event, {
    title: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
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

  const token = event.headers.get("Authorization");

  if (!token) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }

  // validate and add token to event
  try {
    const tkn = validateToken(token.split("Bearer ")[1]);
    const user = await getUser(tkn.email, [], { id: users.id });

    if (!user) {
      throw createError({ statusCode: 403, message: "User not found" });
    }

    return await createPost({ ...body, createdUserId: user.id });
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
