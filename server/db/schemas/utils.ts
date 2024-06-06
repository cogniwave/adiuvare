import { sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

// todo: properly type the retrn of this
export const lower = (email: AnyPgColumn): any => sql`(lower(${email}))`;
