import { pgTable, varchar, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";
import { organizations } from "./organizations.schema";

export const organizationUsers = pgTable(
  "organization_users",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    orgId: varchar("org_id", { length: 255 }).notNull(),
    state: varchar("state", { length: 50 }).notNull(),
    reason: varchar("reason", { length: 255 }),
  },
  (table) => ({
    userOrgUnique: unique().on(table.userId, table.orgId),
  }),
);

export const organizationUsersRelations = relations(organizationUsers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationUsers.orgId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationUsers.userId],
    references: [users.id],
  }),
}));
