import { pgTable, varchar } from "drizzle-orm/pg-core";

export const organizationUsers = pgTable("organization_users", {
  userId: varchar("user_id", { length: 255 }).notNull(),
  orgId: varchar("org_id", { length: 255 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  reason: varchar("reason", { length: 255 }),
});
