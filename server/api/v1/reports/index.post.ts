import { RequiredObject, RequiredString } from "shared/joi/validators";

import type { Report } from "shared/types/report";
import { createReport } from "server/db/reports";
import { notifyNewReport } from "server/services/slack";
import { getValidatedInput, sanitizeInput } from "server/utils/request";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<Report>(event, {
    post: RequiredObject,
    reason: RequiredString,
    user: RequiredString,
  });

  // validate and add token to event
  try {
    await createReport({
      post: body.post,
      reason: sanitizeInput(body.reason),
      reportBy: sanitizeInput(body.user),
    });

    await notifyNewReport(body);

    setResponseStatus(event, 201);
    return "ok";
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "couldnt create report",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
