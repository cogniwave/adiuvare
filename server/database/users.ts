import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";

import { useDrizzle } from "../database";
import { users } from "./dbSchemas/users.db.schema";
import type {
  GetAuthUserResult,
  UpdateAccountPayload,
  UpdatePhotoPayload,
  UpdateProfilePayload,
  UpdateTokenPayload,
  User,
} from "shared/types/user";
import { formatFromDb as fromDb } from "./utils";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

const formatFromDb = fromDb([]);

const _getUser = async <T>(
  email: string,
  filter: Array<Array<SQLiteColumn | string | number | boolean>> = [],
  fields: Record<string, SQLiteColumn> = {},
): Promise<T | undefined> => {
  const result = await useDrizzle()
    .select({ email: users.email, name: users.name, ...fields })
    .from(users)
    .where(and(eq(users.email, email), ...filter.map(([key, value]) => eq(key as SQLiteColumn, value))))
    .limit(1);

  return result.length ? formatFromDb<T>(result[0]!) : undefined;
};

export const getAuthUser = async (email: string) => {
  return await _getUser<GetAuthUserResult>(email, [], {
    id: users.id,
    slug: users.slug,
    password: users.password,
    verified: users.verified,
  });
};

export const addUser = async (payload: any, token: string): Promise<User> => {
  const result = await useDrizzle()
    .insert(users)
    .values({
      email: payload.email,
      password: await hashPassword(payload.password),
      name: payload.name,
      type: payload.type,
      slug: `${payload.email.split("@")[0]}-${nanoid()}`,
      token,
      verified: true,
    })
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
  payload: UpdateProfilePayload | UpdateAccountPayload | UpdatePhotoPayload | UpdateTokenPayload,
) => {
  const foo = await useDrizzle()
    .update(users)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(users.id, userId));

  console.log("updated result", foo);
  return true;
};

export const getUserById = async (id: string, fields?: (keyof User)[]) => {
  const result = await useDrizzle()
    .select(
      !fields?.length
        ? { id: users.id, name: users.name, email: users.email }
        : // @ts-expect-error fix this
          fields.reduce((field, mapped) => (mapped[field] = users[field]), {}),
    )
    .from(users)
    .where(and(eq(users.id, id), eq(users.verified, true)))
    .limit(1);

  return result.length === 1 ? formatFromDb<User>(result[0]) : null;
};

export const updatePassword = async (email: string, password: string, token: string) => {
  await useDrizzle()
    .update(users)
    .set({ password: await hashPassword(password), token: null })
    .where(and(eq(users.email, email), eq(users.token, token)));

  return true;
};
