import { RequiredObject, RequiredString } from "shared/joi/validators";

import type { Report } from "shared/types/report";
import { createReport } from "server/db/reports";
import { notifyNewReport } from "server/services/slack";
import { getValidatedInput, sanitizeInput } from "server/utils/request";
import { log } from "server/utils/logger";

export default defineEventHandler(async (event) => {
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
    log("[reports] couldn't create report", JSON.stringify(err));

    throw err;
  }
});
