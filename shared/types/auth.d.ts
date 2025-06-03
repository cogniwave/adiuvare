import type { UserSession as OgUserSession } from "nuxt-auth-utils";

import type { TokenUser } from "shared/types/user";
import type { Dayjs } from "shared/services/dayjs.service";

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
