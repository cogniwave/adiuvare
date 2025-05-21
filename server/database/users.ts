import { and, eq } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

import { useDrizzle } from "server/database";
import { genToken } from "server/utils";
import type { BaseUser, UpdatePhotoPayload, UpdateProfilePayload, User } from "shared/types/user";
import type { SelectUser } from "./schemas/users.schema";
import { users } from "./schemas/users.schema";
import { formatEntityFromDb as fromDb } from "./utils";

export const formatFromUser = fromDb<User>([]);

export const getUser = async <T = SelectUser>(
  email: string,
  filter: Array<Array<SQLiteColumn | string | number | boolean>> = [],
  fields: Record<string, SQLiteColumn> = {},
): Promise<T | undefined> => {
  const result = await useDrizzle()
    .select({
      email: users.email,
      name: users.name,
      ...fields,
    })
    .from(users)
    .where(and(eq(users.email, email), ...filter.map(([key, value]) => eq(key as SQLiteColumn, value))))
    .limit(1);

  return result.length ? fromDb<T>([])(result[0]!) : undefined;
};

export const addUser = async (payload: BaseUser, token: string): Promise<User | null> => {
  const result = await useDrizzle()
    .insert(users)
    .values({
      email: payload.email,
      password: await hashPassword(payload.password),
      name: payload.name,
      slug: `${payload.email.split("@")[0]}-${genToken()}`,
      token,
      verified: true,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  return result[0] as User;
};

export const verifyUser = async (token: string, email: string): Promise<boolean> => {
  const result = await useDrizzle()
    .update(users)
    .set({ verified: true, token: null })
    .where(and(eq(users.token, token), eq(users.email, email)));

  return (result.rowCount || 0) > 0;
};

export const updateUser = async (
  userId: string,
  payload: UpdateProfilePayload | UpdateAccountPayload | UpdatePhotoPayload,
) => {
  const old = await useDrizzle().select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);

  if (!old?.length) {
    return null;
  }

  await useDrizzle().update(users).set(payload).where(eq(users.id, userId));

  return true;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      slug: users.slug,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      website: users.website,
      address: users.address,
      postalCode: users.postalCode,
      city: users.city,
      district: users.district,
      email: users.email,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.verified, true)))
    .limit(1);
  return result.length === 1 ? formatFromUser(result[0]) : null;
};

export const getUserByEmail = async (email: string) => {
  const result = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      verified: users.verified,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length === 1 ? formatFromUser(result[0]) : null;
};

export const updateUserToken = async (userId: string, token: string) => {
  const user = await useDrizzle().select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);

  if (!user?.length) {
    return false;
  }

  await useDrizzle().update(users).set({ token }).where(eq(users.id, userId));

  return true;
};

export const updatePassword = async (email: string, password: string, token: string) => {
  await useDrizzle()
    .update(users)
    .set({ password: await hashPassword(password), token: null })
    .where(and(eq(users.email, email), eq(users.token, token)));

  return true;
};
