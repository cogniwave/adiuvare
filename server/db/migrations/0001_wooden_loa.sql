ALTER TABLE "users" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "postalCode" varchar(8);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "citdistrict" varchar(128);