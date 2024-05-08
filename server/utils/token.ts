import jwt from "jsonwebtoken";

import type { H3Event, EventHandlerRequest } from "h3";
import type { TokenUser } from "~/types/user";

type VerifiedToken = (jwt.JwtPayload & { user: TokenUser }) | null;

export const signToken = (user: TokenUser, type: "access" | "refresh") => {
  return jwt.sign({ user }, process.env.JWT_KEY as string, {
    expiresIn: type === "access" ? "7m" : "7h",
    audience: ["qaweb", "qaapp"],
    subject: "queroajudaraut",
    issuer: "queroajudar",
  });
};

export const validateToken = (context: H3Event<EventHandlerRequest> | string) => {
  let token: string;

  if (typeof context !== "string") {
    const cookies = parseCookies(context);
    token = cookies["auth:access"] as string;
  } else {
    token = context;
  }

  if (!token) {
    return null;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY as string, {
      audience: ["qaweb", "qaapp"],
      subject: "queroajudaraut",
      issuer: "queroajudar",
    }) as VerifiedToken;

    if (!verified) {
      return null;
    }

    return verified.user;
  } catch (err) {
    console.warn("failed to validate token", err);
    return null;
  }
};
