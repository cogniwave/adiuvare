import { H3Error } from "h3";

import { PostNeedEnum } from "./post";
import type { RequestError } from "../exceptions";

export function isH3Error(err: unknown): err is H3Error {
  return err instanceof H3Error;
}

export function isPostNeed(value: string): value is PostNeedEnum {
  return value in PostNeedEnum;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFetchError = (error: any): error is H3Error<RequestError> => {
  return error.name === "FetchError";
};
