import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  varchar,
  json,
} from "drizzle-orm/pg-core";

import { posts } from "./posts.schema";
import type { UserContact, UserType } from "@/types/user";

export const USER_TYPES: Readonly<[UserType, ...UserType[]]> = ["org", "volunteer"];

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    type: text("type").notNull().$type<UserType>(),
    slug: text("slug").unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    verified: boolean("verified").notNull(),
    token: varchar("token", { length: 128 }),
    contacts: json("contacts").$type<UserContact[]>(),
    bio: text("bio"),
    website: text("website"),
    address: varchar("address", { length: 256 }),
    postalCode: varchar("postal_code", { length: 8 }),
    city: varchar("city", { length: 256 }),
    district: varchar("district", { length: 128 }),
    photo: text("photo"),
    photoThumbnail: text("photo_thumbnail"),
  },
  (users) => ({
    idIdx: uniqueIndex("user_id_idx").on(users.id),
    email: uniqueIndex("user_email_idx").on(users.email),
    slug: uniqueIndex("user_slug_idx").on(users.slug),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts, { relationName: "post_creator" }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
