import { createError } from "h3";

import { validateToken } from "~/server/utils/token";

export default defineEventHandler(async (event) => {
  // do something before the route handler
  const token = event.headers.get("Authorization");

  if (!token) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }

  // validate and add token to event
  try {
    const user = validateToken(token.split("Bearer ")[1]);
    return user;
  } catch (err) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }
});
