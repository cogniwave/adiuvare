import Joi from "joi";
import { compareSync } from "bcrypt";

import { getUser } from "@/server/db/users";
import type { LoginPayload, TokenUser } from "@/types/user";
import { getValidatedInput } from "@/server/utils/request";
import { users } from "@/server/db/schemas/users.schema";
import { setupTokens } from "@/server/utils/token";

const login = async ({ email, password }: LoginPayload): Promise<TokenUser> => {
  const user = await getUser<TokenUser & { password?: string; verified?: boolean }>(email, [], {
    password: users.password,
    slug: users.slug,
    contacts: users.contacts,
    id: users.id,
    verified: users.verified,
  });

  if (!user || !compareSync(password, user.password as string)) {
    throw createError({
      statusCode: 401,
      message: "errors.invalidCredentials",
    });
  }

  if (!user.verified) {
    throw createError({
      statusCode: 400,
      message: "errors.unverifiedUser",
    });
  }

  delete user.password;
  delete user.verified;
  return user;
};

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
    password: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  try {
    const user = await login(body);

    return { user, ...setupTokens(event, user) };
  } catch (err) {
    console.log(err);
    throw createError(err as any);
  }
});
