import Joi from "joi";
import { createError, eventHandler } from "h3";

import { signToken, validateToken } from "~/server/utils/token";
import { getValidatedInput } from "~/server/utils/request";

export default eventHandler(async (event) => {
  const body = await getValidatedInput<{ refreshToken: string }>(event, {
    refreshToken: Joi.string().required().messages({ "strings.empty": "errors.emptyRefreshToken" }),
  });

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
