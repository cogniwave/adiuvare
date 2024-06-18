DO $$ BEGIN
 CREATE TYPE "public"."needs" AS ENUM('money', 'volunteers', 'goods', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."state" AS ENUM('pending', 'active', 'inactive', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postHistory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"title" varchar(264) NOT NULL,
	"description" text NOT NULL,
	"state" "state" DEFAULT 'pending' NOT NULL,
	"locations" text[] NOT NULL,
	"schdule" json NOT NULL,
	"contacts" json NOT NULL,
	"slug" text,
	"needs" needs[] NOT NULL,
	CONSTRAINT "postHistory_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(264) NOT NULL,
	"description" text NOT NULL,
	"locations" text[] NOT NULL,
	"schdule" json NOT NULL,
	"state" "state" DEFAULT 'pending' NOT NULL,
	"needs" needs[] NOT NULL,
	"created_user_id" uuid NOT NULL,
	"slug" text,
	"contacts" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reason" text NOT NULL,
	"reportedBy" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"post" json NOT NULL,
	CONSTRAINT "reports_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"type" text NOT NULL,
	"slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verified" boolean NOT NULL,
	"token" varchar(128),
	"contacts" json,
	"bio" text,
	"photo" text,
	"photo_thumbnail" text,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postHistory" ADD CONSTRAINT "postHistory_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postHistory" ADD CONSTRAINT "postHistory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_created_user_id_users_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "report_history_id_idx" ON "postHistory" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_history_post_idx" ON "postHistory" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_history_user_idx" ON "postHistory" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_id_idx" ON "posts" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_title_idx" ON "posts" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_needs_idx" ON "posts" USING btree ("needs");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_locations_idx" ON "posts" USING btree ("locations");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_id_idx" ON "reports" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "users" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_slug_idx" ON "users" USING btree ("slug");