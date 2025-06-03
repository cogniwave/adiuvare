import { addUser } from "server/database/users";
import { sendEmail } from "server/services/brevo";
import { getValidatedInput } from "server/utils/request";
import { notifyNewUser } from "server/services/slack";
import { subscribeToNewsletter, type NewsletterType } from "server/services/brevo";
import type { BaseUser, User } from "shared/types/user";
import { translate } from "server/utils/i18n";
import logger from "server/utils/logger";
import { newUserSchema } from "shared/schemas/user";

const register = async (payload: BaseUser): Promise<User> => {
  const token = `${genToken(32)}${Date.now()}`;
  const newUser = await addUser(payload, token);

  if (!newUser) {
    throw Error("Something went wrong");
  }

  sendEmail(
    translate("email.accountConfirm.subject"),
    { email: payload.email, name: payload.name },
    "userActionRequired",
    {
      greetings: translate("email.greetings"),
      name: payload.name,
      body: translate("email.accountConfirm.body"),
      body2: translate("email.accountConfirm.body2"),
      buttonText: translate("email.accountConfirm.buttonText"),
      alternativeLinkText: translate("email.alternativeLinkText"),
      link: `${process.env.APP_BASE_URL}/confirmation?token=${token}&email=${payload.email}`,
    },
  );

  return newUser;
};

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<BaseUser>(event, newUserSchema);

  try {
    const user = await register({
      name: body.name,
      password: body.password,
      email: body.email,
    });

    if (body.newsletter) {
      const newsletters: NewsletterType[] = ["newsletter"];

      subscribeToNewsletter(body.email, newsletters);
    }

    notifyNewUser(user);

    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes("UNIQUE constraint")) {
        throw createError({
          data: {
            email: translate("errors.emailExists"),
          },
          statusCode: 422,
          statusMessage: translate("errors.validationError"),
        });
      }

      logger.error("couldn't create user", JSON.stringify(err.message));
    }

    throw createError({
      statusCode: 500,
      statusMessage: translate("errors.unexpected"),
    });
  }
});
