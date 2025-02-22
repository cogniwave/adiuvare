import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { subscribeToNewsletter } from "server/services/brevo";

import { RequiredEmail } from "shared/joi/validators";
import type { NewsletterSubscribePayload } from "shared/types/newsletter";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<NewsletterSubscribePayload>(event, { email: RequiredEmail });

  // validate and add token to event
  try {
    await subscribeToNewsletter(sanitizeInput(body.email), ["newsletter"]);

    return { success: true };
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "couldn't subscribe to newsletter",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
