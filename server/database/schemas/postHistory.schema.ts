import { sqliteTable, text, index, uniqueIndex, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { users } from "./users.schema";
import { posts, POST_STATES } from "./posts.schema";
import type { PostSchedule, PostStateEnum } from "shared/types/post";
import type { UserContact } from "shared/types/user";

export const postHistory = sqliteTable(
  "postHistory",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).$default(() => new Date()),
    title: text("title", { length: 264 }).notNull(),
    description: text("description").notNull(),
    locations: text("locations", { mode: "json" }).notNull().$type<string[]>(),
    schedule: text("schedule", { mode: "json" }).notNull().$type<PostSchedule>(),
    contacts: text("contacts", { mode: "json" }).notNull().$type<UserContact[]>(),
    slug: text("slug").notNull(),
    state: text("state", { enum: POST_STATES }).notNull().default("pending").$type<PostStateEnum>(),
    needs: text("needs").notNull(),
  },
  (postHistory) => [
    uniqueIndex("report_history_id_idx").on(postHistory.id),
    index("report_history_post_idx").on(postHistory.postId),
    index("report_history_user_idx").on(postHistory.userId),
  ],
);

export const postHistoryRelations = relations(postHistory, ({ one }) => ({
  postId: one(posts, {
    fields: [postHistory.postId],
    references: [posts.id],
  }),

  userId: one(users, {
    fields: [postHistory.userId],
    references: [users.id],
  }),
}));

export type InsertPostHistory = typeof postHistory.$inferInsert;
export type SelectPostHistory = typeof postHistory.$inferSelect;
