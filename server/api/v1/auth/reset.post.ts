import Joi from "joi";

import { getUser } from "@/server/db/users";
import { sanitizeInput, getValidatedInput } from "@/server/utils/request";
import { sendEmail } from "@/server/services/mail";

import type { H3Event, EventHandlerRequest } from "h3";
import type { LoginPayload } from "@/types/user";

const sendResetEmail = async (event: H3Event<EventHandlerRequest>) => {
  const body = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  const user = await getUser(sanitizeInput(body.email));

  if (user) {
    const t = await useTranslation(event);

    sendEmail(
      t("email.reset.subject"),
      { email: "tiagoribeiro.1803@gmail.com", name: "tiago" },
      "resetPassword",
      {
        name: "tiago",
        body: t("email.reset.body"),
        body2: t("email.reset.body2"),
        buttonText: t("email.reset.buttonText"),
        alternativeLinkText: t("email.reset.alternativeLinkText"),
        link: `https://${process.env.APP_BASE_URL}/password`,
      },
    );
  }

  return { success: true };
};

export default defineEventHandler(async (event) => {
  return sendResetEmail(event);
});
