import { pgTable, text, timestamp, index, varchar, uuid, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users";
import { needsEnum, posts, stateEnum } from "./posts";
import type { PostSchedule } from "~/types/post";

export const postHistory = pgTable(
  "postHistory",
  {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    updatedAt: timestamp("created_at").notNull(),
    title: varchar("title", { length: 264 }).notNull(),
    description: text("descrition").notNull(),
    state: stateEnum("state").notNull().default("pending"),
    locations: text("locations").array().notNull(),
    schedule: json("schdule").notNull().$type<PostSchedule>(),
    needs: needsEnum("needs").array().notNull(),
  },
  (postHistory) => ({
    idIdx: index("id_idx").on(postHistory.id),
    postId: index("post_idx").on(postHistory.postId),
    userId: index("user_idx").on(postHistory.userId),
  }),
);

export const postsRelations = relations(postHistory, ({ one }) => ({
  creator: one(posts, {
    fields: [postHistory.postId],
    references: [posts.id],
  }),
}));

export const usersRelations = relations(postHistory, ({ one }) => ({
  creator: one(users, {
    fields: [postHistory.userId],
    references: [users.id],
  }),
}));

export type InsertPostHistory = typeof postHistory.$inferInsert;
export type SelectPostHistory = typeof postHistory.$inferSelect;
