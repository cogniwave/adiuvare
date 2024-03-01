import Joi from "joi";

import { verifyUser } from "~/server/db/users";

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const { value, error } = Joi.object<{ token: string }>({
    token: Joi.string().required().min(1).max(255).messages({
      "string.empty": "Token invalido",
      "string.max": "Token invalido",
      "string.min": "Token invalido",
    }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw createError(error as any);
  }

  try {
    if (await verifyUser(value.token)) {
      return { success: true };
    }
  } catch (error) {
    throw createError(error as any);
  }
});
