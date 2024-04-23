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
  id: string;
  name: string;
  email: string;
  slug: string;
  type: UserType;
}

export type ContactType = "email" | "phone" | "other";

export interface UserContact {
  label: string;
  type: ContactType;
  contact: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends RefreshResult {
  user: TokenUser;
}
