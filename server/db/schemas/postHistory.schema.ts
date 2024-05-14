import {
  pgTable,
  text,
  timestamp,
  index,
  varchar,
  uuid,
  json,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users.schema";
import { needsEnum, posts, stateEnum } from "./posts.schema";
import type { PostSchedule } from "@/types/post";
import type { UserContact } from "@/types/user";

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
    contacts: json("contacts").notNull().$type<UserContact[]>(),
    slug: text("slug"),
    needs: needsEnum("needs").array().notNull(),
  },
  (postHistory) => ({
    idIdx: uniqueIndex("report_history_id_idx").on(postHistory.id),
    postId: index("report_history_post_idx").on(postHistory.postId),
    userId: index("report_history_user_idx").on(postHistory.userId),
  }),
);

export const postHistoryRelations = relations(postHistory, ({ one }) => ({
  postId: one(posts, {
    fields: [postHistory.postId],
    references: [posts.id],
  }),

  userid: one(users, {
    fields: [postHistory.userId],
    references: [users.id],
  }),
}));

export type InsertPostHistory = typeof postHistory.$inferInsert;
export type SelectPostHistory = typeof postHistory.$inferSelect;
