import { and, eq } from "drizzle-orm";
import { useDrizzle } from "../db";
import { users } from "./schemas/users.schema";
import { genToken } from "server/utils";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import type { SelectUser } from "./schemas/users.schema";
import type { BaseUser, UpdatePhotoPayload, UpdateProfilePayload, User } from "shared/types/user";
import { formatFromDb as fromDb } from "./utils";

const formatFromDb = fromDb(["contacts"]);

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

  return result.length ? (result[0] as T) : undefined;
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

  return await useDrizzle().update(users).set(payload).where(eq(users.id, userId));
};

export const getUserById = async (id: string) => {
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
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.verified, true)))
    .limit(1);
  //if (result.length !== 1) return null;
  return result.length === 1 ? formatFromDb<User>(result[0]) : null;
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
  return await useDrizzle()
    .update(users)
    .set({ password: await hashPassword(password), token: null })
    .where(and(eq(users.email, email), eq(users.token, token)));
};
