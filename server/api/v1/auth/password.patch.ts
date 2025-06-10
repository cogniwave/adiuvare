import { z } from "zod/v4";

import { updatePassword } from "server/database/users";
import { getValidatedInput } from "server/utils/request";
import { sendEmail } from "server/services/brevo";

import { translate } from "server/utils/i18n";
import { emailSchema, passwordSchema, tokenSchema } from "shared/schemas/common.schema";
import dayjs from "shared/services/dayjs.service";

const schema = z.object({ token: tokenSchema, email: emailSchema, password: passwordSchema });

type PasswordUpdatePayload = z.infer<typeof schema>;

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<PasswordUpdatePayload>(event, schema);

  if (dayjs(body.token.split("-")[1]).isAfter(dayjs().add(12, "hours"))) {
    throw createError({
      data: [translate("errors.expiredResetLink")],
      message: "Invalid link",
      statusCode: 422,
    });
  }

  await updatePassword(body.email, body.password, body.token);

  sendEmail(translate("email.resetSuccess.subject"), { email: body.email }, "information", {
    greetings: translate("email.greetings"),
    body: translate("email.resetSuccess.body"),
  });

  setResponseStatus(event, 200);
  return { success: true };
});
