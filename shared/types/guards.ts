import { DrizzleError } from "drizzle-orm";
import { H3Error } from "h3";

import { PostNeedEnum } from "./post";

export function isDrizzleError(err: unknown): err is DrizzleError {
  return err instanceof DrizzleError;
}

export function isH3Error(err: unknown): err is H3Error {
  return err instanceof H3Error;
}

export function isPostNeed(value: string): value is PostNeedEnum {
  return value in PostNeedEnum;
}
