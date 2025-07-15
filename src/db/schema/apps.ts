import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import forms from "./forms";

const apps = pgTable("app", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  link: text("link").notNull(),
  description: varchar("description", { length: 2048 }),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const appsRelations = relations(
  apps,
  ({ many }) => ({
    forms: many(forms),
  })
);

export default apps;
