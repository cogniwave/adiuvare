/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { UserSession as OgUserSession } from "nuxt-auth-utils";

import type { TokenUser } from "./user";
import type { Dayjs } from "../services/dayjs.service";

declare module "#auth-utils" {
  interface UserSession extends OgUserSession {
    loggedInAt: Dayjs;
  }

  interface User extends TokenUser {}

  interface SecureSessionData {}
}

declare module "h3" {
  interface H3EventContext {
    user: TokenUser;
  }
}

export {};
