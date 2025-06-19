import {
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import formChapters from "./formChapters";
import apps from "./apps";

const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: varchar("description", { length: 2048 }),
  appId: uuid("app_id").references(() => apps.id),
});

export const formsRelations = relations(
  forms,
  ({ many, one }) => ({
    app: one(apps, {
      fields: [forms.appId],
      references: [apps.id],
    }),
    formChapters: many(formChapters),
  })
);

export default forms;
