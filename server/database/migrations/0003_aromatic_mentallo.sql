PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(264) NOT NULL,
	`description` text NOT NULL,
	`locations` text NOT NULL,
	`schedule` text NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`needs` text NOT NULL,
	`created_user_id` text NOT NULL,
	`slug` text NOT NULL,
	`contacts` text NOT NULL,
	`updated_by` text,
	`created_at` integer DEFAULT '"2025-07-26T15:59:12.553Z"' NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`created_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "title", "description", "locations", "schedule", "state", "needs", "created_user_id", "slug", "contacts", "updated_by", "created_at", "updated_at") SELECT "id", "title", "description", "locations", "schedule", "state", "needs", "created_user_id", "slug", "contacts", "updated_by", "created_at", "updated_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_id_unique` ON `posts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_id_idx` ON `posts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `post_title_idx` ON `posts` (`title`);--> statement-breakpoint
CREATE INDEX `post_locations_idx` ON `posts` (`locations`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`type` text NOT NULL,
	`slug` text,
	`verified` integer NOT NULL,
	`token` text(128),
	`bio` text,
	`address` text(256),
	`postal_code` text(8),
	`city` text(256),
	`district` text(128),
	`photo` text,
	`photo_thumbnail` text,
	`created_at` integer DEFAULT '"2025-07-26T15:59:12.553Z"' NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "type", "slug", "verified", "token", "bio", "address", "postal_code", "city", "district", "photo", "photo_thumbnail", "created_at", "updated_at") SELECT "id", "name", "email", "password", "type", "slug", "verified", "token", "bio", "address", "postal_code", "city", "district", "photo", "photo_thumbnail", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_slug_unique` ON `users` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_idx` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_slug_idx` ON `users` (`slug`);--> statement-breakpoint
ALTER TABLE `contacts` ADD `created_at` integer DEFAULT '"2025-07-26T15:59:12.553Z"' NOT NULL;--> statement-breakpoint
ALTER TABLE `contacts` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `organizations` ADD `normalized_name` text NOT NULL;--> statement-breakpoint
CREATE INDEX `org_name` ON `organizations` (`name`);--> statement-breakpoint
CREATE INDEX `org_normalized_name` ON `organizations` (`normalized_name`);