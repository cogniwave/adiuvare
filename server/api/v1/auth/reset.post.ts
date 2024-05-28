import Joi from "joi";

import { getUser, updateUserToken } from "@/server/db/users";
import { sanitizeInput, getValidatedInput } from "@/server/utils/request";
import { sendEmail } from "@/server/services/mail";
import { users } from "@/server/db/schemas/users.schema";

import type { H3Event, EventHandlerRequest } from "h3";
import type { LoginPayload } from "@/types/user";

interface User {
  email: string;
  name: string;
  type: string;
  id: string;
}

const sendResetEmail = async (event: H3Event<EventHandlerRequest>) => {
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
          name: user.name,
          body: t("email.reset.body"),
          body2: t("email.reset.body2"),
          buttonText: t("email.reset.buttonText"),
          alternativeLinkText: t("email.reset.alternativeLinkText"),
          link: `https://${process.env.APP_BASE_URL}/password?token=${token}&email=${user.email}`,
        },
      );
    }
  }

  return { success: true };
};

export default defineEventHandler(async (event) => {
  return sendResetEmail(event);
});
