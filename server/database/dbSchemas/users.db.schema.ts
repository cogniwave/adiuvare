import { relations } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { posts } from "./posts.db.schema";
import type { UserType } from "shared/types/user";
import { addressDbSchema, datesDbSchema, photoDbSchema } from "./utils";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    type: text("type").notNull().$type<UserType>(),
    slug: text("slug").unique(),
    verified: integer("verified", { mode: "boolean" }).notNull(),
    token: text("token", { length: 128 }),
    bio: text("bio"),
    ...addressDbSchema,
    ...photoDbSchema,
    ...datesDbSchema,
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
