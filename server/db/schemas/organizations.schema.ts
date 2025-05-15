import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { posts } from "./posts.schema";
import { users } from "./users.schema";
import { addressSchema } from "~~/server/api/v1/organizations/common";
//import { organizationUsers } from "./schemas/organizationUsers.schema";

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    displayName: text("display_name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id),
    /* email: text("email").unique().notNull(),
    password: text("password").notNull(), */
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    slug: text("slug").unique(),
    createdAt: integer("created_at", { mode: "timestamp" }),
    nipc: text("nipc"),
    acceptSameDomainUsers: integer("accept_same_domain_users", { mode: "boolean" }).notNull().default(false),
    token: text("token", { length: 128 }),
    about: text("about"),
    website: text("website"),
    ...addressSchema,
    photo: text("photo"),
    photoThumbnail: text("photo_thumbnail"),
    category: text("category").notNull().default("unknown"), // validar com Joi depois
  },
  (organizations) => [
    uniqueIndex("orgs_id_idx").on(organizations.id),
    //uniqueIndex("orgs_email_idx").on(organizations.email),
    uniqueIndex("orgs_slug_idx").on(organizations.slug),
  ],
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  posts: many(posts, { relationName: "post_creator" }),
}));

export type InsertOrganization = typeof organizations.$inferInsert;
export type SelectOrganization = typeof organizations.$inferSelect;
