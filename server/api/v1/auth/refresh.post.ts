import Joi from "joi";
import { createError, eventHandler, readBody } from "h3";
import { signToken, validateToken } from "~/server/utils/token";

export default eventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const result = Joi.object<{ refreshToken: string }>({
    refreshToken: Joi.string()
      .required()
      .messages({ "strings.empty": "errors.emptyRefreshToken" }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (result.error) {
    throw createError({
      statusCode: 403,
      statusMessage: "errors.noRefreshToken",
    });
  }

  const user = validateToken(body.refreshToken);

  if (!user) {
    throw createError({
      statusCode: 403,
      statusMessage: "errors.invalidRefreshToken",
    });
  }

  return {
    token: {
      accessToken: signToken(user, "access"),
      refreshToken: signToken(user, "refresh"),
    },
  };
});
