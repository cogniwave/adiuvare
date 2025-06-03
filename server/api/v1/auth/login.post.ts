import { RequiredEmail, RequiredPassword } from "shared/validators";

import dayjs from "shared/services/dayjs.service";
import { getUser } from "server/database/users";
import { getValidatedInput, defineWrappedResponseHandler } from "server/utils/request";
import { users } from "server/database/schemas/users.schema";
import { translate } from "server/utils/i18n";

import type { LoginPayload, TokenUser } from "shared/types/user";

export default defineWrappedResponseHandler(async (event) => {
  const { email, password } = await getValidatedInput<LoginPayload>(event, {
    email: RequiredEmail,
    password: RequiredPassword,
  });

  const user = await getUser<TokenUser & { password: string; verified: boolean }>(email, [], {
    password: users.password,
    slug: users.slug,
    contacts: users.contacts,
    id: users.id,
    logo: users.photo,
    verified: users.verified,
  });

  if (!user || !(await verifyPassword(user.password!, password))) {
    throw createError({
      statusCode: 422,
      statusMessage: "unprocessable content",
      message: translate("errors.invalidCredentials"),
    });
  }

  if (!user.verified) {
    throw createError({
      statusCode: 409,
      statusMessage: "conflict",
      message: translate("errors.unverifiedUser"),
    });
  }

  const authedUser: TokenUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    slug: user.slug,
    type: user.type,
    logo: user.logo,
    contacts: user.contacts || [],
  };
  await setUserSession(event, { user: authedUser, loggedInAt: dayjs() });
  setResponseStatus(event, 201);
  return authedUser;
});
