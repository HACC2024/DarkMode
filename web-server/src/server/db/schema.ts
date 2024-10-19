// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator, varchar, serial, decimal } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `web-server_${name}`);

export const devices = createTable("devices", {
  id: varchar("id").notNull().primaryKey(),
});

export const links = createTable("links", {
  id: serial("id").primaryKey(),
  device_name: varchar("device_name", { length: 32 }),
  watts: decimal("watts"),
  device_id: varchar("device_id", { length: 32 }).references(() => devices.id),
  switch_id: varchar("switch_id", { length: 32 }).references(() => switches.id),
});

export const switches = createTable("switches", {
  id: varchar("id").notNull().primaryKey(),
});

export type Device = typeof devices.$inferSelect;
