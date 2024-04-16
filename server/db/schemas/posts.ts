import { pgEnum, pgTable, text, timestamp, index, varchar, uuid, json } from "drizzle-orm/pg-core";

import { users } from "./users";
import { PostSchedule } from "~/types/post";
import { relations } from "drizzle-orm";

export const POST_STATES: Readonly<[string, ...string[]]> = [
  "pending",
  "visible",
  "hidden",
  "unapproved",
];

export const POST_NEEDS: Readonly<[string, ...string[]]> = [
  "money",
  "volunteers",
  "goods",
  "other",
];

export const needsEnum = pgEnum("needs", POST_NEEDS);

export const stateEnum = pgEnum("state", POST_STATES);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    title: varchar("title", { length: 264 }).notNull(),
    description: text("descrition").notNull(),
    locations: text("locations").array().notNull(),
    schedule: json("schdule").notNull().$type<PostSchedule>(),
    state: stateEnum("state").notNull().default("pending"),
    needs: needsEnum("needs").array().notNull(),
    createdUserId: uuid("created_user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedBy: uuid("updated_by").references(() => users.id),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (posts) => ({
    titleIdx: index("title_idx").on(posts.title),
    needsIdx: index("needs_idx").on(posts.needs),
    locationsIdx: index("locations_idx").on(posts.locations),
  }),
);

export const postsRelations = relations(posts, ({ one }) => ({
  createdUserId: one(users, {
    fields: [posts.createdUserId],
    references: [users.id],
  }),
  updatedUserId: one(users, {
    fields: [posts.updatedBy],
    references: [users.id],
  }),
}));

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
