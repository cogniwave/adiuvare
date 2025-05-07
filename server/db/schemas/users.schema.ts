import { relations } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { posts } from "./posts.schema";
import type { UserType } from "shared/types/user";

export const USER_TYPES: Readonly<[UserType, ...UserType[]]> = ["org", "volunteer"];

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    type: text("type").notNull().$type<UserType>(),
    slug: text("slug").unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    verified: integer("verified", { mode: "boolean" }).notNull(),
    token: text("token", { length: 128 }),
    subscribedNewsletter: integer("subscribed_newsletter", { mode: "boolean" }).notNull().default(false),
    bio: text("bio"),
    website: text("website"),
    address: text("address", { length: 256 }),
    postalCode: text("postal_code", { length: 8 }),
    city: text("city", { length: 256 }),
    district: text("district", { length: 128 }),
    photo: text("photo"),
    photoThumbnail: text("photo_thumbnail"),
  },
  (users) => [
    uniqueIndex("user_id_idx").on(users.id),
    uniqueIndex("user_email_idx").on(users.email),
    uniqueIndex("user_slug_idx").on(users.slug),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts, { relationName: "post_creator" }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
