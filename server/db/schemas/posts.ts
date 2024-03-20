import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  index,
  varchar,
  uuid,
  json,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { PostSchedule } from "~/types/post";
import { relations } from "drizzle-orm";

export const needsEnum = pgEnum("needs", [
  "money",
  "volunteers",
  "goods",
  "other",
]);

export const stateEnum = pgEnum("state", [
  "pending",
  "visible",
  "hidden",
  "unapproved",
]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    title: varchar("title", { length: 264 }).notNull(),
    description: text("descrition").notNull(),
    locations: text("locations").notNull(),
    schedule: json("schdule").notNull().$type<PostSchedule>(),
    state: stateEnum("state").default("pending"),
    needs: needsEnum("needs").notNull(),
    createdUserId: uuid("created_user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (posts) => ({
    titleIdx: index("title_idx").on(posts.title),
    needsIdx: index("needs_idx").on(posts.needs),
    locationsIdx: index("locations_idx").on(posts.locations),
  }),
);

export const postsRelations = relations(posts, ({ one }) => ({
  creator: one(users, {
    fields: [posts.createdUserId],
    references: [users.id],
  }),
}));

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
