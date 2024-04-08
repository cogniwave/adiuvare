import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  json,
} from "drizzle-orm/pg-core";

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    reason: text("reason").notNull(),
    reportBy: text("reportedBy").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    post: json("post").notNull(),
  },
  (reports) => ({
    idIdx: index("id").on(reports.id),
  }),
);

export type InsertReport = typeof reports.$inferInsert;
export type SelectReport = typeof reports.$inferSelect;
