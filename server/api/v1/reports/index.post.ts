import Joi from "joi";

import type { Report } from "@/types/report";
import { createReport } from "@/server/db/reports";
import { notifyNewReport } from "@/server/services/slack";
import { getValidatedInput, sanitizeInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<Report>(event, {
    post: Joi.object().required().messages({ "strings.empty": "errors.empty" }),
    reason: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
    user: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  // validate and add token to event
  try {
    await createReport({
      post: sanitizeInput(body.post),
      reason: sanitizeInput(body.reason),
      reportBy: sanitizeInput(body.user),
    });

    notifyNewReport(body);

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
      statusMessage: "errors.unexpected",
    });
  }
});
