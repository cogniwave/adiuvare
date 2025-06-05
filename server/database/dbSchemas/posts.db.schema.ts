import { sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { users } from "./users.db.schema";
import type { PostState, PostSchedule } from "shared/types/post";
import type { Contact } from "shared/types/contact";
import { datesDbSchema } from "./utils";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    title: text("title", { length: 264 }).notNull(),
    description: text("description").notNull(),
    locations: text("locations", { mode: "json" }).notNull().$type<string[]>(),
    schedule: text("schedule", { mode: "json" }).notNull().$type<PostSchedule>(),
    state: text("state").notNull().default("pending").$type<PostState>(),
    needs: text("needs").notNull(),
    createdUserId: text("created_user_id")
      .notNull()
      .references(() => users.id),
    slug: text("slug").notNull(),
    contacts: text("contacts", { mode: "json" }).notNull().$type<Contact[]>(),
    updatedBy: text("updated_by").references(() => users.id),
    ...datesDbSchema,
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
