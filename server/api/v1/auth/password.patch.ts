import { updatePassword } from "server/database/users";
import { getValidatedInput } from "server/utils/request";
import { sendEmail } from "server/services/brevo";

import { translate } from "server/utils/i18n";
import { RequiredEmail, RequiredPassword, RequiredString } from "shared/validators";
import dayjs from "shared/services/dayjs.service";

interface PasswordUpdatePayload {
  email: string;
  password: string;
  token: string;
}

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<PasswordUpdatePayload>(event, {
    password: RequiredPassword,
    email: RequiredEmail,
    token: RequiredString.messages({ "strings.empty": translate("errors.empty") }),
  });

  if (dayjs(body.token.split("-")[1]).isAfter(dayjs().add(12, "hours"))) {
    throw createError({
      data: [translate("errors.expiredResetLink")],
      message: "Invalid link",
      statusCode: 400,
    });
  }

  await updatePassword(sanitizeInput(body.email), sanitizeInput(body.password), sanitizeInput(body.token));

  await sendEmail(translate("email.resetSuccess.subject"), { email: body.email }, "information", {
    greetings: translate("email.greetings"),
    body: translate("email.resetSuccess.body"),
  });

  setResponseStatus(event, 200);
  return { success: true };
});
