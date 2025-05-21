import { pgTable, varchar } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), 
  contact: varchar("contact", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), 
});
