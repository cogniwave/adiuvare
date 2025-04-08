import { drizzle } from "drizzle-orm/d1";

import { users } from "./schemas/users.schema";
import { posts } from "./schemas/posts.schema";
import { postHistory } from "./schemas/postHistory.schema";
import { reports } from "./schemas/reports.schema";
import hubDatabase from "@nuxthub/core"; //colcado por mim R


const schema = { users, posts, postHistory, reports };

export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
