import Joi from "joi";

import { getUser, updateUserToken } from "@/server/db/users";
import { sanitizeInput, getValidatedInput } from "@/server/utils/request";
import { sendEmail } from "@/server/services/mail";
import { users } from "@/server/db/schemas/users.schema";

import type { LoginPayload } from "@/types/user";

interface User {
  email: string;
  name: string;
  type: string;
  id: string;
}

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  const user = await getUser<User>(sanitizeInput(body.email), [], { id: users.id });

  if (user) {
    const t = await useTranslation(event);

    const token = `${genToken(32)}-${Date.now()}`;

    if (await updateUserToken(user.id, token)) {
      sendEmail(
        t("email.reset.subject"),
        { email: user.email, name: user.name },
        "userActionRequired",
        {
          greetings: t("email.greetings"),
          name: user.name,
          body: t("email.reset.body"),
          body2: t("email.reset.body2"),
          buttonText: t("email.reset.buttonText"),
          alternativeLinkText: t("email.reset.alternativeLinkText"),
          link: `${process.env.APP_BASE_URL}/profile/password?token=${token}&email=${user.email}`,
        },
      );
    }
  }

  return { success: true };
});
