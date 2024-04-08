import Joi from "joi";

import type { Report } from "~/types/report";
import { createReport } from "~/server/db/reports";
import { notifyNewReport } from "~/server/services/slack";

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const { value: payload, error } = Joi.object<Report>({
    post: Joi.object().required().messages({ "strings.empty": "errors.empty" }),
    reason: Joi.string()
      .required()
      .messages({ "strings.empty": "errors.empty" }),
    user: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw createError({
      data: error.details.map((d) => d.message),
      message: "Invalid params",
      statusCode: 422,
    });
  }

  // validate and add token to event
  try {
    await createReport({
      post: payload.post,
      reason: payload.reason,
      reportBy: payload.user,
    });

    notifyNewReport(payload);

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
