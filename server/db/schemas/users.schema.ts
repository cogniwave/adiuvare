import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { posts } from "./posts.schema";
import { sqliteTable, text, uniqueIndex, integer } from "drizzle-orm/sqlite-core";
import type { UserType } from "shared/types/user";
import { addressSchema } from "../partials/addressSchema";
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    type: text("type").notNull().$type<UserType>().default("user"),
    slug: text("slug").unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    verified: integer("verified", { mode: "boolean" }).notNull(),
    token: text("token", { length: 128 }),
    bio: text("bio"),
    website: text("website"),
    ...addressSchema,
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
