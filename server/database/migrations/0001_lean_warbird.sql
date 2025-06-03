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
	`created_at` integer DEFAULT '"2025-04-03T09:55:38.209Z"' NOT NULL,
	`updated_by` text,
	`updated_at` integer,
	FOREIGN KEY (`created_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "title", "description", "locations", "schedule", "state", "needs", "created_user_id", "slug", "contacts", "created_at", "updated_by", "updated_at") SELECT "id", "title", "description", "locations", "schedule", "state", "needs", "created_user_id", "slug", "contacts", "created_at", "updated_by", "updated_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_id_unique` ON `posts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_id_idx` ON `posts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `post_title_idx` ON `posts` (`title`);--> statement-breakpoint
CREATE INDEX `post_needs_idx` ON `posts` (`needs`);--> statement-breakpoint
CREATE INDEX `post_locations_idx` ON `posts` (`locations`);