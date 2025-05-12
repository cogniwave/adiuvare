import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { posts } from "./posts.schema";
import { users } from "./users.schema";

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    displayName: text("display_name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    slug: text("slug").unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    verified: integer("verified", { mode: "boolean" }).notNull(),
    // type: text("type").notNull().$type<UserType>(), //colei, senão não faria sentido um getTotalOrgs
    // Campos opcionais
    nipc: text("nipc"),
    acceptSameDomainUsers: integer("accept_same_domain_users", { mode: "boolean" }).notNull().default(true),
    token: text("token", { length: 128 }),
    about: text("about"),
    website: text("website"),
    address: text("address"),
    postalCode: text("postal_code"),
    city: text("city"),
    district: text("district"),
    photo: text("photo"),
    photoThumbnail: text("photo_thumbnail"),
    category: text("category").notNull().default("unknown"), // validar com Joi depois
  },
  (organizations) => [
    uniqueIndex("orgs_id_idx").on(organizations.id),
    uniqueIndex("orgs_email_idx").on(organizations.email),
    uniqueIndex("orgs_slug_idx").on(organizations.slug),
  ],
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  posts: many(posts, { relationName: "post_creator" }),
}));

export type InsertOrganization = typeof organizations.$inferInsert;
export type SelectOrganization = typeof organizations.$inferSelect;
