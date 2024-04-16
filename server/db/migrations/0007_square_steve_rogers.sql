CREATE TABLE IF NOT EXISTS "postHistory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"title" varchar(264) NOT NULL,
	"descrition" text NOT NULL,
	"state" "state" DEFAULT 'pending' NOT NULL,
	"locations" text[] NOT NULL,
	"schdule" json NOT NULL,
	"needs" needs[] NOT NULL,
	CONSTRAINT "postHistory_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "postHistory" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_idx" ON "postHistory" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "postHistory" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postHistory" ADD CONSTRAINT "postHistory_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postHistory" ADD CONSTRAINT "postHistory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
