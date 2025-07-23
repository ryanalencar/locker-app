CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`registration` text NOT NULL,
	`locker_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_registration_unique` ON `users` (`registration`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_locker_id_unique` ON `users` (`locker_id`);