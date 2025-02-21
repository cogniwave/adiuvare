import Joi from "joi";

import { sanitizeInput, getValidatedInput } from "~~/server/utils/request";
import { subscribeToNewsletter } from "~~/server/services/brevo";

import type { NewsletterSubscribePayload } from "~~/shared/types/newsletter";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<NewsletterSubscribePayload>(event, {
    email: Joi.string()
      .required()
      .email({})
      .messages({
        "string.empty": t("errors.empty"),
        "string.max": t("errors.max", 255),
        "string.email": t("errors.invalidEmail"),
      }),
  });

  // validate and add token to event
  try {
    await subscribeToNewsletter(sanitizeInput(body.email), ["newsletter"]);

    return { success: true };
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "couldnt subscribe to newsletter",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
