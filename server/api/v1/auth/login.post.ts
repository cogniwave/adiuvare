import Joi from "joi";
import { compareSync } from "bcrypt";

import { getUser } from "@/server/db/users";
import { sanitizeInput, getValidatedInput } from "@/server/utils/request";
import { users } from "@/server/db/schemas/users.schema";
import { setupTokens } from "@/server/utils/token";

import type { LoginPayload, TokenUser } from "@/types/user";
import type { TranslationFunction } from "@/types";

const login = async (
  email: string,
  password: string,
  t: TranslationFunction,
): Promise<TokenUser> => {
  const user = await getUser<TokenUser & { password?: string; verified?: boolean }>(email, [], {
    password: users.password,
    slug: users.slug,
    contacts: users.contacts,
    id: users.id,
    logo: users.photo,
    verified: users.verified,
  });

  if (!user || !compareSync(password, user.password as string)) {
    throw createError({
      statusCode: 401,
      message: t("errors.invalidCredentials"),
    });
  }

  if (!user.verified) {
    throw createError({
      statusCode: 400,
      message: t("errors.unverifiedUser"),
    });
  }

  delete user.password;
  delete user.verified;
  return user;
};

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),
    password: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),
  });

  try {
    const user = await login(sanitizeInput(body.email), sanitizeInput(body.password), t);

    return { user, ...setupTokens(event, user) };
  } catch (err) {
    console.log(err);
    throw createError(err as any);
  }
});
