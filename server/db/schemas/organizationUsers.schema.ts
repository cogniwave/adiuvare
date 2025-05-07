import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizationUsers = sqliteTable("organization_users", {
  userId: text("user_id").notNull(), 
  orgId: text("org_id").notNull(), 
  state: text("state").notNull().$type<"pending" | "accepted" | "rejected">(), 
  reason: text("reason"), // obrigatório apenas se state for "rejected"
});
