import { H3Error } from "h3";

import { postNeeds, type PostNeed, type PostSchedule, type ScheduleType } from "./post";
import type { RequestError } from "shared/exceptions";

export function isH3Error(err: unknown): err is H3Error {
  return err instanceof H3Error;
}

export function isPostNeed(value: string): value is PostNeed {
  return value in postNeeds;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFetchError = (error: any): error is H3Error<RequestError> => {
  return error.name === "FetchError";
};

export const isSpecificSchedule = (sch?: PostSchedule<ScheduleType>): sch is PostSchedule<"specific"> => {
  return sch?.type === "specific";
};
