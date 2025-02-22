import Joi from "joi";
import { compareSync } from "bcrypt";

import dayjs from "shared/services/dayjs.service";
import { getUser } from "server/db/users";
import { getValidatedInput, defineWrappedResponseHandler } from "server/utils/request";
import { users } from "server/db/schemas/users.schema";

import type { LoginPayload, TokenUser } from "shared/types/user";

export default defineWrappedResponseHandler(async (event) => {
  const t = await useTranslation(event);

  const { email, password } = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),
    password: Joi.string()
      .required()
      .messages({ "strings.empty": t("errors.empty") }),
  });

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
      statusMessage: "unauthorized",
      message: t("errors.invalidCredentials"),
    });
  }

  if (!user.verified) {
    throw createError({
      statusCode: 400,
      message: t("errors.unverifiedUser"),
    });
  }

  delete user.verified;
  delete user.password;
  await setUserSession(event, { user, loggedInAt: dayjs() });
  setResponseStatus(event, 201);
  return user;
});
