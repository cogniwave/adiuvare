import { isSpecificSchedule } from "shared/types/guards";
import type { PostSchedule, ScheduleType } from "shared/types/post";

export const getScheduleDay = (schedule?: PostSchedule<ScheduleType>) => {
  return isSpecificSchedule(schedule) ? schedule.payload.day : "";
};

export const getScheduleTimes = (schedule?: PostSchedule<ScheduleType>) => {
  return isSpecificSchedule(schedule) ? schedule.payload.times : [];
};
