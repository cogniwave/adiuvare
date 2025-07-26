import { sqliteTable, text, uniqueIndex, integer, int, index } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import type { OrganizationCategory } from "shared/types/organization";
import { addressDbSchema, photoDbSchema } from "./utils";

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    name: text("name").notNull(),
    normalized_name: text("name").notNull(),
    category: text("category").default("unknown").$type<OrganizationCategory>(),
    slug: text("slug").unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    verified: integer("verified", { mode: "boolean" }).default(false),
    token: text("token", { length: 128 }),
    about: text("about"),
    website: text("website"),
    nipc: integer("nipc"),
    autoAcceptSameDomainUsers: int("auto_accept_same_domain_users", { mode: "boolean" }).default(false),
    ...addressDbSchema,
    ...photoDbSchema,
  },
  (organizations) => [
    uniqueIndex("org_slug_idx").on(organizations.slug),
    uniqueIndex("org_nipc_idx").on(organizations.nipc),
    index("org_name").on(organizations.name),
    index("org_normalized_name").on(organizations.normalized_name),
  ],
);
