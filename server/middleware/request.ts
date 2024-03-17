import { createError } from "h3";

import { validateToken } from "../utils/token";

const PROTECTED_ROUTES: string[] = [];

export default defineEventHandler(async (event) => {
  if (!PROTECTED_ROUTES.includes(event.path)) {
    return;
  }

  // do something before the route handler
  const token = event.headers.get("Authorization");

  if (!token) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }

  // validate and add token to event
  try {
    const user = validateToken(token.split("Bearer ")[1]);
    (event as any).user = user;
    // todo: add
    // event.context.sessions = { ...event.context.sessions, user: user };
  } catch (err) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }
});
