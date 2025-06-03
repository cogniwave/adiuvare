import { nanoid } from "nanoid";
import { z } from "zod/v4";

import { getUser, updateUserToken } from "server/database/users";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { sendEmail } from "server/services/brevo";
import { users } from "server/database/schemas/users.schema";
import { translate } from "server/utils/i18n";

import { emailSchema } from "shared/validators";

interface User {
  email: string;
  name: string;
  type: string;
  id: string;
}

const schema = z.object({ email: emailSchema });

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<z.infer<typeof schema>>(event, schema);

  const user = await getUser<User>(sanitizeInput(body.email), [], { id: users.id });

  if (user) {
    const token = `${nanoid(32)}-${Date.now()}`;

    if (await updateUserToken(user.id, token)) {
      sendEmail(translate("email.reset.subject"), { email: user.email, name: user.name }, "userActionRequired", {
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
