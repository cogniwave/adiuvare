import joi from ".";
import { ScheduleType } from "shared/types/post";

export const PostScheduleRule = joi.object().keys({
  type: joi
    .string()
    .valid(...Object.values(ScheduleType))
    .required(),
  // todo: determine payload validation based on type
  payload: joi.object(),
});
