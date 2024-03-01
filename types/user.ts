export type UserType = "org" | "volunteer";

export interface BaseUser {
  name: string;
  email: string;
  password: string;
  type: UserType;
}

export interface User extends Omit<BaseUser, "password"> {
  id: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface DbUser extends User {
  password?: string;
  verified?: boolean;
}

export interface UnverifiedUser extends Omit<DbUser, "id"> {
  token: string;
}

export interface TokenUser {
  name: string;
  email: string;
  type: UserType;
}
