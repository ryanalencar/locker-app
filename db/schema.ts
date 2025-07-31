import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name"),
  username: text("username").notNull().unique(),
  registration: text("registration").notNull().unique(),
})

export const lockers = sqliteTable("lockers", {
  id: integer("id").primaryKey({autoIncrement: true}),
  user_id: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("available"),
})

export type User = typeof users.$inferSelect;
export type Locker = typeof lockers.$inferSelect;
export enum LockerStatus {
  AVAILABLE = "available", 
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance"
}