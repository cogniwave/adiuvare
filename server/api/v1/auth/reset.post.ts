import { getUser, updateUserToken } from "server/db/users";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { sendEmail } from "server/services/brevo";
import { users } from "server/db/schemas/users.schema";
import { translate } from "server/utils/i18n";

import { RequiredEmail } from "shared/validators";
import type { LoginPayload } from "shared/types/user";

interface User {
  email: string;
  name: string;
  type: string;
  id: string;
}

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<LoginPayload>(event, { email: RequiredEmail });
  const user = await getUser<User>(sanitizeInput(body.email), [], { id: users.id });

  if (user) {
    const token = `${genToken(32)}-${Date.now()}`;

    if (await updateUserToken(user.id, token)) {
      await sendEmail(translate("email.reset.subject"), { email: user.email, name: user.name }, "userActionRequired", {
        greetings: translate("email.greetings"),
        name: user.name,
        body: translate("email.reset.body"),
        body2: translate("email.reset.body2"),
        buttonText: translate("email.reset.buttonText"),
        alternativeLinkText: translate("email.alternativeLinkText"),
        link: `${process.env.APP_BASE_URL}/profile/password?token=${token}&email=${user.email}`,
      });
    }
  }

  return { success: true };
});
