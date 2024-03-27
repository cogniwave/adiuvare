import Joi from "joi";

import type { CreatePostPayload } from "~/types/post";
import { createPost } from "~/server/db/posts";
import { getUser } from "~/server/db/users";
import { users } from "~/server/db/schemas/users";

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const { value: payload, error } = Joi.object<CreatePostPayload>({
    title: Joi.string()
      .required()
      .messages({ "strings.empty": "Não pode ser vazio" }),
    description: Joi.string()
      .required()
      .messages({ "strings.empty": "Não pode ser vazio" }),
    needs: Joi.array()
      .items(Joi.string().valid("volunteers", "money", "goods", "other"))
      .required()
      .messages({
        "strings.empty": "Não pode ser vazio",
        "strings.valid": "Campo invalido",
      }),
    locations: Joi.array()
      .items(Joi.string())
      .required()
      .messages({ "strings.empty": "Não pode ser vazio" }),
    schedule: Joi.object()
      .required()
      .messages({ "strings.empty": "Não pode ser vazio" }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw createError({
      data: error.details.map((d) => d.message),
      message: "Invalid params",
      statusCode: 422,
    });
  }

  const token = event.headers.get("Authorization");

  console.log();

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

    return await createPost({ ...payload, createdUserId: user.id });
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "couldnt create post",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong on our side",
    });
  }
});
