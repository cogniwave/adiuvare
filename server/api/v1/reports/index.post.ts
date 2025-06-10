import type { Report } from "shared/types/report";
import { createReport } from "server/database/reports";
import { notifyNewReport } from "server/services/slack";
import { getValidatedInput } from "server/utils/request";
import { reportSchema } from "shared/schemas/report.schema";

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<Report>(event, reportSchema);

  // validate and add token to event
  await createReport({ post: body.post, reason: body.reason, reportBy: body.user });

  notifyNewReport(body);

  setResponseStatus(event, 201);
});
