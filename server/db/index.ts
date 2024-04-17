import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { users } from "./schemas/users.schema";
import { posts } from "./schemas/posts.schema";

export const db = drizzle(sql, {
  schema: { users, posts },
});
