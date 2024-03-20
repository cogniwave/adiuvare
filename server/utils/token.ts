import jwt from "jsonwebtoken";

import { TokenUser } from "~/types/user";
import { InvalidToken } from "~/exceptions";

type VerifiedToken = (jwt.JwtPayload & { user: TokenUser }) | null;

export const signToken = (user: TokenUser, type: "access" | "refresh") => {
  return jwt.sign({ user }, process.env.JWT_KEY as string, {
    expiresIn: type === "access" ? "7m" : "7h",
    audience: ["qaweb", "qaapp"],
    subject: "queroajudaraut",
    issuer: "queroajudar",
  });
};

export const validateToken = (token: string) => {
  const tkn = jwt.verify(token, process.env.JWT_KEY as string, {
    audience: ["qaweb", "qaapp"],
    subject: "queroajudaraut",
    issuer: "queroajudar",
  }) as VerifiedToken;

  if (!tkn) {
    throw new InvalidToken();
  }

  return tkn.user;
};
