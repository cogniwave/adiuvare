CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reason" text NOT NULL,
	"reportedBy" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"post" json NOT NULL,
	CONSTRAINT "reports_id_unique" UNIQUE("id"),
	CONSTRAINT "reports_reason_unique" UNIQUE("reason"),
	CONSTRAINT "reports_reportedBy_unique" UNIQUE("reportedBy")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id" ON "reports" ("id");