import Joi from "joi";
import { createError, eventHandler } from "h3";

import { signToken, validateToken } from "~/server/utils/token";
import { getValidatedInput } from "~/server/utils/request";

export default eventHandler(async (event) => {
  const body = await getValidatedInput<{ refreshToken: string }>(event, {
    refreshToken: Joi.string().required().messages({ "strings.empty": "errors.emptyRefreshToken" }),
  });

  // todo: since refresh happens slightly before access token expires,
  // we need to invalidate previous access token as well.
  const user = validateToken(body.refreshToken);

  if (!user) {
    throw createError({
      statusCode: 403,
      statusMessage: "errors.invalidRefreshToken",
    });
  }

  return {
    accessToken: signToken(user, "access"),
    refreshToken: signToken(user, "refresh"),
  };
});
