DO $$ BEGIN
 CREATE TYPE "needs" AS ENUM('money', 'volunteers', 'goods', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "state" AS ENUM('pending', 'visible', 'hidden', 'unapproved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(264) NOT NULL,
	"descrition" text NOT NULL,
	"locations" text NOT NULL,
	"schdule" json NOT NULL,
	"state" "state" DEFAULT 'pending',
	"needs" "needs" NOT NULL,
	"created_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"verified" boolean NOT NULL,
	"token" varchar(128),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "posts" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "needs_idx" ON "posts" ("needs");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locations_idx" ON "posts" ("locations");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_created_user_id_users_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
