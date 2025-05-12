import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { organizations } from "./organizations.schema";

export const organizationUsers = sqliteTable("organization_users", {
  userId: text("user_id").notNull(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  state: text("status").notNull().$type<"pending" | "accepted" | "rejected">(),
  reason: text("reason"), // obrigatório apenas se state for "rejected"
});
