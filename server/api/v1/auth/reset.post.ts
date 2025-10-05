import { nanoid } from "nanoid";
import { z } from "zod/v4";

import { getUserById, updateUser } from "server/database/users";
import { validateEvent } from "server/utils/request";
import { sendEmail } from "server/services/brevo";
import { translate } from "server/utils/i18n";

import { emailSchema } from "shared/schemas/common.schema";

const schema = z.object({ email: emailSchema });

export default defineWrappedResponseHandler(async (event) => {
  const body = await validateEvent<z.infer<typeof schema>>(event, schema);

  const user = await getUserById(body.email);

  if (user) {
    const token = `${nanoid(32)}-${Date.now()}`;

    if (await updateUser(user.id, { token })) {
      sendEmail(translate("email.reset.subject"), { email: user.email, name: user.name }, "userActionRequired", {
        greetings: translate("email.greetings"),
        name: user.name,
        body: translate("email.reset.body"),
        body2: translate("email.reset.body2"),
        buttonText: translate("email.reset.buttonText"),
        alternativeLinkText: translate("email.alternativeLinkText"),
        link: `${useRuntimeConfig().public.baseUrl}/profile/password?token=${token}&email=${user.email}`,
      });
    }
  }

  return { success: true };
});
