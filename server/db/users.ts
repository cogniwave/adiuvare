import { hashSync } from "bcrypt";

import query from "./";
import { UnverifiedUser, DbUser } from "~/types/user";

const SALT = 10;

export const getUser = async <T = DbUser>(
  email: string,
  fields = "*",
  filter = "",
): Promise<T> => {
  const result = await query(
    `SELECT ${fields} FROM users WHERE email=$1 ${filter} LIMIT 1`,
    [email],
  );

  return result.rows[0] || null;
};

export const addUser = async (
  payload: UnverifiedUser,
): Promise<UnverifiedUser> => {
  const result = await query(
    "INSERT INTO users (email, password, name, type, verified, created_at, token) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      payload.email,
      hashSync(payload.password as string, SALT),
      payload.name,
      payload.type,
      false,
      new Date(),
      payload.token,
    ],
  );

  return result.rowCount || 0 ? result.rows[0] : null;
};

export const verifyUser = async (token: string): Promise<boolean> => {
  const result = await query(
    "UPDATE users SET verified = true WHERE token = $2",
    [token],
  );

  return (result.rowCount || 0) > 0;
};
