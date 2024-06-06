DROP INDEX IF EXISTS "post_slug_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "post_title_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "post_needs_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "post_locations_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_slug_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_slug_idx" ON "posts" ("(lower("posts"."slug"))");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_title_idx" ON "posts" ("(lower("posts"."title"))");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_needs_idx" ON "posts" ("(lower("posts"."needs"))");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_locations_idx" ON "posts" ("(lower("posts"."locations"))");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_idx" ON "users" ("(lower("users"."email"))");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_slug_idx" ON "users" ("(lower("users"."slug"))");