import { drizzle } from "drizzle-orm/d1";

import { users } from "./schemas/users.schema";
import { posts } from "./schemas/posts.schema";
import { organizations } from "./schemas/organizations.schema";
import { postHistory } from "./schemas/postHistory.schema";
import { reports } from "./schemas/reports.schema";

const schema = { users, posts, organizations, postHistory, reports };

export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
