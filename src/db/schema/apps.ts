import {
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import forms from "./forms";

const apps = pgTable("app", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  link: text("link").notNull(),
  description: varchar("description", { length: 2048 }),
});

export const appsRelations = relations(
  apps,
  ({ many }) => ({
    forms: many(forms),
  })
);

export default apps;
