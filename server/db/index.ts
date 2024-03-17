import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { users } from "./schemas/users";
import { posts } from "./schemas/posts";

export const db = drizzle(sql, {
  schema: { users, posts },
});
