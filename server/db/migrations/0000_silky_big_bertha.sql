CREATE TABLE `postHistory` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer,
	`title` text(264) NOT NULL,
	`description` text NOT NULL,
	`locations` text NOT NULL,
	`schedule` text NOT NULL,
	`contacts` text NOT NULL,
	`slug` text NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`needs` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `postHistory_id_unique` ON `postHistory` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `report_history_id_idx` ON `postHistory` (`id`);--> statement-breakpoint
CREATE INDEX `report_history_post_idx` ON `postHistory` (`post_id`);--> statement-breakpoint
CREATE INDEX `report_history_user_idx` ON `postHistory` (`user_id`);--> statement-breakpoint
CREATE TABLE `posts` (
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
	`created_at` integer DEFAULT '"2025-04-01T13:21:27.332Z"' NOT NULL,
	`updated_by` text,
	`updated_at` integer,
	FOREIGN KEY (`created_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_id_unique` ON `posts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_id_idx` ON `posts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `post_title_idx` ON `posts` (`title`);--> statement-breakpoint
CREATE INDEX `post_needs_idx` ON `posts` (`needs`);--> statement-breakpoint
CREATE INDEX `post_locations_idx` ON `posts` (`locations`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reason` text NOT NULL,
	`reportedBy` text NOT NULL,
	`created_at` integer NOT NULL,
	`post` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reports_id_unique` ON `reports` (`id`);--> statement-breakpoint
CREATE INDEX `report_id_idx` ON `reports` (`id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`type` text NOT NULL,
	`slug` text,
	`created_at` integer NOT NULL,
	`verified` integer NOT NULL,
	`token` text(128),
	`contacts` text,
	`bio` text,
	`website` text,
	`address` text(256),
	`postal_code` text(8),
	`city` text(256),
	`district` text(128),
	`photo` text,
	`photo_thumbnail` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_slug_unique` ON `users` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_idx` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_slug_idx` ON `users` (`slug`);