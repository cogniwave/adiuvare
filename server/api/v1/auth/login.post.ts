import Joi from "joi";
import { compareSync } from "bcrypt";

import { getUser } from "~/server/db/users";
import { LoginPayload, TokenUser } from "~/types/user";
import { signToken } from "~/server/utils/token";
import { users } from "~/server/db/schemas/users";

const login = async ({ email, password }: LoginPayload): Promise<TokenUser> => {
  const user = await getUser<TokenUser & { password?: string }>(
    email,
    [["verified", true]],
    { password: users.password },
  );

  if (!user || !compareSync(password, user.password as string)) {
    throw createError({
      statusCode: 401,
      message: "errors.invalidCredentials",
    });
  }

  delete user.password;
  return user;
};

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const { value: payload, error } = Joi.object<LoginPayload>({
    email: Joi.string()
      .required()
      .messages({ "strings.empty": "errors.empty" }),
    password: Joi.string()
      .required()
      .messages({ "strings.empty": "errors.empty" }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw createError(error);
  }

  try {
    const user = await login(payload);

    return {
      token: {
        accessToken: signToken(user, "access"),
        refreshToken: signToken(user, "refresh"),
      },
    };
  } catch (err) {
    console.log(err);
    throw createError(err as any);
  }
});
