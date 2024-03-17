import { randomBytes } from "crypto";
import { hashSync } from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "./";
import { users } from "./schemas/users";
import type { InsertUser, SelectUser } from "./schemas/users";
import type { BaseUser } from "~/types/user";

const SALT = 10;

export const getUser = async <T = SelectUser>(
  email: string,
  fields: Record<string, boolean> = {},
  filter: Record<string, any> = {},
): Promise<T | undefined> => {
  return (await db.query.users.findFirst({
    columns: fields,
    with: { email, ...filter },
  })) as T;
};

export const addUser = async (
  payload: BaseUser,
): Promise<InsertUser | null> => {
  const result = await db.insert(users).values({
    email: payload.email,
    password: hashSync(payload.password as string, SALT),
    name: payload.name,
    type: payload.type,
    token: randomBytes(128).toString("hex"),
    createdAt: new Date(),
    verified: false,
  } as InsertUser);

  return result.rowCount || 0 ? result.rows[0] : null;
};

export const verifyUser = async (token: string): Promise<boolean> => {
  const result = await db
    .update(users)
    .set({ verified: true, token: null })
    .where(eq(users.token, token));

  return (result.rowCount || 0) > 0;
};
