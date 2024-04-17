import { randomBytes } from "crypto";
import { hashSync } from "bcrypt";
import { eq, or } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { db } from "./";
import { users } from "./schemas/users.schema";
import type { SelectUser } from "./schemas/users.schema";
import type { BaseUser, User } from "~/types/user";
import { genSlugToken } from "~/server/utils";

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
    .where(or(eq(users.email, email), ...filter.map(([key, value]) => eq(key, value))))
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
      slug: `${payload.email.split("@")[0]}-${genSlugToken()}`,
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
