DROP INDEX IF EXISTS "id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "post_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "title_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "needs_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "locations_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "id";--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "slug_idx";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "slug" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "report_history_id_idx" ON "postHistory" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_history_post_idx" ON "postHistory" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_history_user_idx" ON "postHistory" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_id_idx" ON "posts" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_slug_idx" ON "posts" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_title_idx" ON "posts" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_needs_idx" ON "posts" ("needs");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_locations_idx" ON "posts" ("locations");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_id_idx" ON "reports" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "users" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_slug_idx" ON "users" ("slug");