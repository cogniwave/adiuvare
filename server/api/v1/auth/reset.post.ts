import { getUser, updateUserToken } from "server/db/users";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { sendEmail } from "server/services/brevo";
import { users } from "server/db/schemas/users.schema";

import { RequiredEmail } from "shared/joi/validators";
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
    const t = await useTranslation(event);

    const token = `${genToken(32)}-${Date.now()}`;

    if (await updateUserToken(user.id, token)) {
      await sendEmail(t("email.reset.subject"), { email: user.email, name: user.name }, "userActionRequired", {
        greetings: t("email.greetings"),
        name: user.name,
        body: t("email.reset.body"),
        body2: t("email.reset.body2"),
        buttonText: t("email.reset.buttonText"),
        alternativeLinkText: t("email.alternativeLinkText"),
        link: `${process.env.APP_BASE_URL}/profile/password?token=${token}&email=${user.email}`,
      });
    }
  }

  return { success: true };
});
