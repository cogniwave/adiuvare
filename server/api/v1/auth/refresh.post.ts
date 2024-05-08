import Joi from "joi";
import { createError, eventHandler } from "h3";

import { signToken, validateToken } from "~/server/utils/token";
import { getValidatedInput } from "~/server/utils/request";

export default eventHandler(async (event) => {
  const body = await getValidatedInput<{ token: string }>(event, {
    token: Joi.string().required().messages({ "strings.empty": "errors.emptyRefreshToken" }),
  });

  // todo: since refresh happens slightly before access token expires,
  // we need to invalidate previous access token as well.
  const user = validateToken(body.token);

  if (!user) {
    deleteCookie(event, "auth:access");
    deleteCookie(event, "auth:refresh");

    throw createError({
      statusCode: 401,
      statusMessage: "errors.invalidRefreshToken",
    });
  }

  const accessToken = signToken(user, "access");

  console.log("aqui, acces", accessToken);

  setCookie(event, "auth:access", accessToken, {
    maxAge: 300, // 5 minutes
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  });

  return accessToken;
});
