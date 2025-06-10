import type { z } from "zod/v4";

import { getAuthUser } from "server/database/users";
import { getValidatedInput, defineWrappedResponseHandler } from "server/utils/request";
import { translate } from "server/utils/i18n";

import type { TokenUser } from "shared/types/user";
import { loginSchema } from "shared/schemas/user.schema";

export default defineWrappedResponseHandler(async (event) => {
  const { email, password } = await getValidatedInput<z.infer<typeof loginSchema>>(event, loginSchema);

  const user = await getAuthUser(email);

  if (!user || !(await verifyPassword(user.password!, password))) {
    throw createError({
      statusCode: 422,
      message: translate("errors.invalidCredentials"),
    });
  }

  if (!user.verified) {
    throw createError({
      statusCode: 409,
      message: translate("errors.unverifiedUser"),
    });
  }

  const authedUser: TokenUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    slug: user.slug,
  };
  await setUserSession(event, authedUser);
  setResponseStatus(event, 201);
  return authedUser;
});
