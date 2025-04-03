import { and, asc, count, eq } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

import { useDrizzle } from "../db";
import { users } from "./schemas/users.schema";
import type { SelectUser } from "./schemas/users.schema";
import type { BaseUser, UpdatePhotoPayload, UpdateProfilePayload, User } from "shared/types/user";
import { genToken } from "server/utils";
import { formatFromDb as fromDb, formatToDb as toDb } from "./utils";

const formatFromDb = fromDb(["contacts"]);
const formatToDb = toDb(["contacts"]);

export const getUser = async <T = SelectUser>(
  email: string,
  filter: Array<Array<SQLiteColumn | string | number | boolean>> = [],
  fields: Record<string, SQLiteColumn> = {},
): Promise<T | undefined> => {
  const result = await useDrizzle()
    .select({
      email: users.email,
      type: users.type,
      name: users.name,
      ...fields,
    })
    .from(users)
    .where(and(eq(users.email, email), ...filter.map(([key, value]) => eq(key as SQLiteColumn, value))))
    .limit(1);

  return result.length ? formatFromDb<T>(result[0]!) : undefined;
};

export const addUser = async (payload: BaseUser, token: string): Promise<User | null> => {
  const result = await useDrizzle()
    .insert(users)
    .values(
      formatToDb({
        email: payload.email,
        password: await hashPassword(payload.password),
        name: payload.name,
        type: payload.type,
        slug: `${payload.email.split("@")[0]}-${genToken()}`,
        token,
        verified: false,
      }),
    )
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      type: users.type,
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

export const getUserById = async (id: string) => {
  const result = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      slug: users.slug,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
      website: users.website,
      address: users.address,
      postalCode: users.postalCode,
      city: users.city,
      district: users.district,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.verified, true)))
    .limit(1);

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
  await useDrizzle()
    .update(users)
    .set({ password: await hashPassword(password), token: null })
    .where(and(eq(users.email, email), eq(users.token, token)));

  return true;
};

// **********
// org specific stuffs
export const getOrgs = async () => {
  const result = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      slug: users.slug,
      email: users.email,
      bio: users.bio,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
      website: users.website,
      address: users.address,
      postalCode: users.postalCode,
      city: users.city,
      district: users.district,
    })
    .from(users)
    .where(and(eq(users.type, "org"), eq(users.verified, true)))
    .orderBy(asc(users.name))
    .limit(50);

  return formatFromDb<User[]>(result) || [];
};

export const getTotalOrgs = async () => {
  const result = await useDrizzle().select({ total: count() }).from(users).where(eq(users.type, "org"));

  try {
    return result[0]!.total ?? 0;
  } catch (_) {
    return 0;
  }
};

export const getOrgBySlug = async (slug: string) => {
  const result = await useDrizzle()
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      slug: users.slug,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
      website: users.website,
      address: users.address,
      postalCode: users.postalCode,
      city: users.city,
      district: users.district,
    })
    .from(users)
    .where(and(eq(users.slug, slug), eq(users.verified, true)))
    .limit(1);

  return result.length === 1 ? formatFromDb<User>(result[0]) : null;
};
