import { randomBytes } from "crypto";
import { hashSync } from "bcrypt";
import { and, asc, count, eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { db } from "./";
import { users } from "./schemas/users.schema";
import type { SelectUser } from "./schemas/users.schema";
import type { BaseUser, User, UpdateUserPayload, UpdatePhotoPayload } from "@/types/user";
import { genToken } from "@/server/utils";

const SALT = 10;

export const getUser = async <T = SelectUser>(
  email: string,
  filter: Array<Array<string | any>> = [],
  fields: Record<string, PgColumn> = {},
): Promise<T | undefined> => {
  const result = await db
    .select({
      email: users.email,
      type: users.type,
      name: users.name,
      ...fields,
    })
    .from(users)
    .where(and(eq(users.email, email), ...filter.map(([key, value]) => eq(key, value))))
    .limit(1);

  return result.length ? (result[0] as T) : undefined;
};

export const addUser = async (payload: BaseUser): Promise<User | null> => {
  const result = await db
    .insert(users)
    .values({
      email: payload.email,
      password: hashSync(payload.password as string, SALT),
      name: payload.name,
      type: payload.type,
      slug: `${payload.email.split("@")[0]}-${genToken()}`,
      token: randomBytes(32).toString("hex"),
      verified: false,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      type: users.type,
    });

  return result[0] as User;
};

export const verifyUser = async (token: string): Promise<boolean> => {
  const result = await db
    .update(users)
    .set({ verified: true, token: null })
    .where(eq(users.token, token));

  return (result.rowCount || 0) > 0;
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload | UpdatePhotoPayload,
) => {
  const old = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);

  if (!old?.length) {
    return null;
  }

  return db.update(users).set(payload).where(eq(users.id, userId)).returning({
    id: users.id,
    slug: users.slug,
    contacts: users.contacts,
    name: users.name,
    email: users.email,
    type: users.type,
  });
};

export const getUserById = async (id: string) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      slug: users.slug,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.verified, true)))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};

// org specific stuffs
export const getOrgs = async () => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      slug: users.slug,
      email: users.email,
    })
    .from(users)
    .where(and(eq(users.type, "org"), eq(users.verified, true)))
    .orderBy(asc(users.name))
    .limit(50);

  return result || [];
};

export const getTotalOrgs = async () => {
  const result = await db.select({ total: count() }).from(users).where(eq(users.type, "org"));

  try {
    return result[0].total ?? 0;
  } catch (_) {
    return 0;
  }
};

export const getUserBySlug = async (slug: string) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
      slug: users.slug,
      photo: users.photo,
      photoThumbnail: users.photoThumbnail,
      contacts: users.contacts,
    })
    .from(users)
    .where(and(eq(users.slug, slug), eq(users.verified, true)))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};

export const updateUserToken = async (userId: string, token: string) => {
  const user = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);

  if (!user?.length) {
    return false;
  }

  await db.update(users).set({ token }).where(eq(users.id, userId));

  return true;
};
