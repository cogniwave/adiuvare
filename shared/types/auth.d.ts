import type { TokenUser } from "shared/types/user";

declare module "#auth-utils" {
  interface User extends TokenUser {}

  interface SecureSessionData {}
}

declare module "h3" {
  interface H3EventContext {
    user: TokenUser;
  }
}

export {};
