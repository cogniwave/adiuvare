export type UserType = "org" | "volunteer";

export interface BaseUser {
  name: string;
  email: string;
  password: string;
  type: UserType;
}

export interface User extends Omit<BaseUser, "password"> {
  id: string;
  slug: string;
  bio?: string;
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
  contacts: UserContact[];
}

export type ContactType = "email" | "phone" | "other";

export interface UserContact {
  type: ContactType;
  contact: string;
}

export interface LoginResult {
  user: TokenUser;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateUserPayload {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  contacts?: UserContact[];
}

export interface UpdatePhotoPayload {
  photo?: string;
  photoThumbnail?: string;
}

// type == org

export interface GetOrganizationsResult {
  organizations: User[];
  total: number;
}
