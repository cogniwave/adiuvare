import { nanoid } from "nanoid";
import { z } from "zod/v4";

import { addUser } from "server/database/users";
import { sendEmail, subscribeToNewsletter } from "server/services/brevo";
import { getValidatedInput } from "server/utils/request";
import { notifyNewUser } from "server/services/slack";
import type { User } from "shared/types/user";
import { translate } from "server/utils/i18n";
import logger from "server/utils/logger";
import { createUserSchema } from "shared/schemas/user.schema";

const schema = z.object({ newsletter: z.boolean().default(false), ...createUserSchema.shape });

const register = async (payload: z.infer<typeof createUserSchema>): Promise<{ user: User; token: string }> => {
  const token = `${nanoid(32)}${Date.now()}`;

  try {
    return { token, user: await addUser(payload, token) };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("UNIQUE constraint")) {
      throw createError({
        data: {
          email: translate("errors.emailExists"),
        },
        statusCode: 422,
        message: translate("errors.validationError"),
      });
    }

    logger.error("couldn't create user", JSON.stringify(err));

    throw err;
  }
};

export default defineWrappedResponseHandler(async (event) => {
  const body = await getValidatedInput<z.infer<typeof schema>>(event, schema);

  const { token, user } = await register({ name: body.name, password: body.password, email: body.email });

  Promise.all([
    () =>
      sendEmail(
        translate("email.accountConfirm.subject"),
        { email: user.email, name: user.name },
        "userActionRequired",
        {
          greetings: translate("email.greetings"),
          name: user.name,
          body: translate("email.accountConfirm.body"),
          body2: translate("email.accountConfirm.body2"),
          buttonText: translate("email.accountConfirm.buttonText"),
          alternativeLinkText: translate("email.alternativeLinkText"),
          link: `${process.env.APP_BASE_URL}/confirmation?token=${token}&email=${user.email}`,
        },
      ),
    () => notifyNewUser(user),
    () => body.newsletter && subscribeToNewsletter(body.email),
  ]);

  return user;
});
