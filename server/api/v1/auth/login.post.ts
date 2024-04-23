import Joi from "joi";
import { compareSync } from "bcrypt";

import { getUser } from "~/server/db/users";
import { LoginPayload, TokenUser } from "~/types/user";
import { signToken } from "~/server/utils/token";
import { getValidatedInput } from "~/server/utils/request";
import { users } from "~/server/db/schemas/users.schema";

const login = async ({ email, password }: LoginPayload): Promise<TokenUser> => {
  const user = await getUser<TokenUser & { password?: string }>(email, [["verified", true]], {
    password: users.password,
    slug: users.slug,
    id: users.id,
  });

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
  const body = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
    password: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  try {
    const user = await login(body);

    const accessToken = signToken(user, "access");
    const refreshToken = signToken(user, "refresh");

    setCookie(event, "auth:access", accessToken, {
      maxAge: 300, // 5 minutes
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });

    setCookie(event, "auth:refresh", refreshToken, {
      maxAge: 21600, // 6 hours
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });

    return { user, accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    throw createError(err as any);
  }
});
