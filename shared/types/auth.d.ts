import type { TokenUser } from "./user";
import type { Dayjs } from "../services/dayjs.service";

interface SessionUser {
  email: string;
}

declare module "#auth-utils" {
  interface UserSession {
    user: TokenUser;
    loggedInAt: Dayjs;
  }

  interface SecureSessionData {
    email: string;
  }
}

declare module "h3" {
  interface H3EventContext {
    user: SessionUser;
  }
}

export {};
