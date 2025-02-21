import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";

import type { Post } from "~/types/post";

export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey().unique().notNull().$defaultFn(createId),
    reason: text("reason").notNull(),
    reportBy: text("reportedBy").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    post: text("post", { mode: "json" }).notNull().$type<Post>(),
  },
  (reports) => [index("report_id_idx").on(reports.id)],
);

export type InsertReport = typeof reports.$inferInsert;
export type SelectReport = typeof reports.$inferSelect;
