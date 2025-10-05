import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";

import type { EntityType } from "shared/types/contact";
import { datesDbSchema } from "./utils";

export const contacts = sqliteTable(
  "contacts",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    entityId: text("entity_id").notNull(),
    entityType: text("entity_type").notNull().$type<EntityType>(),
    contact: text("contact").notNull(),
    type: text("type").notNull(),
    ...datesDbSchema,
  },
  (contacts) => [
    index("contacts_entity_id").on(contacts.entityId),
    index("contacts_entity_type").on(contacts.entityType),
  ],
);
