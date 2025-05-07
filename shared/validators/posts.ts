import joi from ".";
import { ScheduleType } from "shared/types/post";

const scheduleTimeSchema = joi.object({
  start: joi
    .string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  end: joi
    .string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
});

const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const PostScheduleRule = joi.object().keys({
  type: joi
    .string()
    .valid(...Object.values(ScheduleType))
    .required(),
  payload: joi.when("type", {
    switch: [
      {
        is: ScheduleType.SPECIFIC,
        then: joi.object({
          day: joi
            .string()
            .valid(...validDays)
            .required(),
          times: joi.array().items(scheduleTimeSchema).min(1).required(),
        }),
      },
      {
        is: ScheduleType.RECURRING,
        then: joi.object().pattern(joi.string().valid(...validDays), joi.array().items(scheduleTimeSchema).min(1)),
      },
    ],
    otherwise: joi.forbidden(),
  }),
});
