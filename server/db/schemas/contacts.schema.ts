import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";


export const contacts = sqliteTable("contacts", {
  entityId: text("id").primaryKey().unique().notNull().$defaultFn(createId),
  entityType: text("entity_type").notNull().$type<"organization" | "user">(), // enum no validator
  contact: text("contact").notNull(),
  type: text("type").notNull().$type<"email" | "phone" | "fax" | "other">(), // enum no validator
});
