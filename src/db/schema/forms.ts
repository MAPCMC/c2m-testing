import {
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import formChapters from "./formChapters";

const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: varchar("description", { length: 2048 }),
  app_name: text("app_name"),
  app_link: text("app_link"),
});

export const formsRelations = relations(
  forms,
  ({ many }) => ({
    formChapters: many(formChapters),
  })
);

export default forms;
