export enum UserTypeEnum {
  ADMIN = "admin",
  USER = "user",
}

export type UserType = "user" | "admin";

export interface BaseUser {
  name: string;
  email: string;
  password: string;
  type: UserType;
  newsletter?: boolean;
}

export interface User extends Omit<BaseUser, "password"> {
  id: string;
  slug: string;
  bio?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  photo?: string;
  photoThumbnail?: string;
  contacts?: UserContact[];
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
  logo: string;
  contacts: UserContact[];
}

export type ContactType = "email" | "phone" | "other";

export interface UserContact {
  type: ContactType;
  contact: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends Tokens {
  user: TokenUser;
}

export interface UpdateProfilePayload {
  name: string;
  slug: string;
  bio?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  contacts?: UserContact[];
}

export interface UpdateAccountPayload {
  email?: string;
  password?: string;
}

export interface UpdatePhotoPayload {
  photo?: string;
  photoThumbnail?: string;
}

export interface UpdateUserPayload {
  field: string;
  value: string | UserContact[];
}

// type == org

export interface GetOrganizationsResult {
  organizations: User[];
  total: number;
}
