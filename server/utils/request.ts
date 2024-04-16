import Joi from "joi";
import { H3Event, EventHandlerRequest } from "h3";

// make this a separate function to call on functions where we need to get current logged user
// this could be a middleware but we wouldn't use it in every request so it'd be wasted time
export const getSessionUser = async (event: H3Event<EventHandlerRequest>) => {
  const token = event.headers.get("Authorization");

  if (!token) {
    throw createError({ statusCode: 403, message: "Token not found" });
  }

  const user = validateToken(token.split("Bearer ")[1]);

  if (!user) {
    throw createError({ statusCode: 403, message: "User not found" });
  }

  return user;
};

export const getValidatedInput = async <T>(
  event: H3Event<EventHandlerRequest>,
  schema: Joi.PartialSchemaMap,
) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const { value, error } = Joi.object<T>(schema).validate(body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw createError({
      data: error.details.map((d) => d.message),
      message: "Invalid params",
      statusCode: 422,
    });
  }

  return value;
};
