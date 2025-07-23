import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name"),
  username: text("username").notNull().unique(),
  registration: text("registration").notNull().unique(),
  locker_id: text("locker_id").notNull().unique(),
})

export type User = typeof users.$inferSelect;