import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

import type { OrganizationUserState } from "shared/types/userOrganizations";

export const organizationUsers = sqliteTable(
  "organizationUsers",
  {
    userId: text("user_id").notNull(),
    orgId: text("org_id").notNull(),
    state: text("state").notNull().default("pending").$type<OrganizationUserState>(),
    isOwner: integer("is_owner", { mode: "boolean" }).default(false),
    reason: text("reason"),
    createdAt: integer("created_at", { mode: "timestamp" }),
  },
  (organizationUsers) => [primaryKey({ columns: [organizationUsers.userId, organizationUsers.orgId] })],
);
