import type { z } from "zod/v4";

import type { newUserSchema, updateAccountSchema, updateProfileSchema } from "shared/schemas/user";

export type UserType = "user" | "admin";

export type BaseUser = z.infer<typeof newUserSchema>;

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
  nipc?: string;
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

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends Tokens {
  user: TokenUser;
}

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export type UpdateAccountPayload = z.infer<typeof updateAccountSchema>;

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
