import jwt from "jsonwebtoken";

import { TokenUser } from "~/types/user";
import { InvalidToken } from "~/exceptions";

export const signToken = (user: TokenUser, type: "access" | "refresh") => {
  return jwt.sign(user, process.env.JWT_KEY as string, {
    expiresIn: type === "access" ? "15m" : "1d",
    audience: "queroajudar",
    subject: "queroajudaraut",
    issuer: "queroajudar",
  });
};

export const validateToken = (token: string) => {
  const user = jwt.verify(token, process.env.JWT_KEY as string, {
    audience: "queroajudar",
    subject: "queroajudaraut",
    issuer: "queroajudar",
  });

  if (!user) {
    throw new InvalidToken();
  }

  return user;
};
