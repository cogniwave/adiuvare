import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    type: text("type").notNull(),
    slug: text("slug").unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    verified: boolean("verified").notNull(),
    token: varchar("token", { length: 128 }),
  },
  (users) => ({
    email: uniqueIndex("email_idx").on(users.email),
    slug: uniqueIndex("slug_idx").on(users.slug),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
