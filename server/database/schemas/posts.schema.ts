import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { users } from "./users.schema";
import { PostNeed, PostStateEnum, type PostSchedule } from "../../../shared/types/post";
import type { UserContact } from "../../../shared/types/user";

export const POST_STATES = Object.values(PostStateEnum) as [string, ...string[]];

export const POST_NEEDS = Object.values(PostNeed) as [string, ...string[]];

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    title: text("title", { length: 264 }).notNull(),
    description: text("description").notNull(),
    locations: text("locations", { mode: "json" }).notNull().$type<string[]>(),
    schedule: text("schedule", { mode: "json" }).notNull().$type<PostSchedule>(),
    state: text("state", { enum: POST_STATES }).notNull().default("pending").$type<PostStateEnum>(),
    needs: text("needs").notNull(),
    createdUserId: text("created_user_id")
      .notNull()
      .references(() => users.id),
    slug: text("slug").notNull(),
    contacts: text("contacts", { mode: "json" }).notNull().$type<UserContact[]>(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(new Date()),
    updatedBy: text("updated_by").references(() => users.id),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
  },
  (posts) => [
    uniqueIndex("post_id_idx").on(posts.id),
    uniqueIndex("post_slug_idx").on(posts.slug),
    index("post_title_idx").on(posts.title),
    index("post_locations_idx").on(posts.locations),
  ],
);

export const postsRelations = relations(posts, ({ one }) => ({
  createdUserId: one(users, {
    fields: [posts.createdUserId],
    references: [users.id],
    relationName: "post_creator",
  }),

  updatedUserId: one(users, {
    fields: [posts.updatedBy],
    references: [users.id],
    relationName: "post_updater",
  }),
}));

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
