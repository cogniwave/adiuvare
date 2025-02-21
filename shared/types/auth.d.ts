interface SessionUser {
  email: string;
}

declare module "#auth-utils" {
  interface User {
    email: string;
  }

  interface UserSession {
    email: string;
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
