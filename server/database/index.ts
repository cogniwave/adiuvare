import { drizzle } from "drizzle-orm/d1";

import { users } from "./dbSchemas/users.db.schema";
import { posts } from "./dbSchemas/posts.db.schema";
import { postHistory } from "./dbSchemas/postHistory.db.schema";
import { reports } from "./dbSchemas/reports.db.schema";

const schema = { users, posts, postHistory, reports };

export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
