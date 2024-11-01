// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { pgTableCreator, varchar, integer } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `web-server_${name}`);

export const devices = createTable("devices", {
  id: varchar("id").notNull().primaryKey(),
  device_name: varchar("device_name", { length: 32 }),
  watts: integer("watts").default(0).notNull(),
});

export const deviceRelations = relations(devices, ({ one }) => ({
  switchInfo: one(switches),
}));

export const switches = createTable("switches", {
  id: varchar("id").notNull().primaryKey(),
  device_id: varchar("device_id", { length: 32 })
    .references(() => devices.id, {
      onDelete: "set null",
    })
    .unique(),
});

export const switchRelations = relations(switches, ({ one }) => ({
  device: one(devices, {
    fields: [switches.device_id],
    references: [devices.id],
  }),
}));
