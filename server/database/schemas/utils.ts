import { sql } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const lower = (email: AnySQLiteColumn): ReturnType<typeof sql> => sql`(lower(${email}))`;
