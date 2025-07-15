import {
  boolean,
  pgTable,
  text,
  serial,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import questions from "./questions";
import forms from "./forms";

const formChapters = pgTable("form_chapter", {
  id: serial("id").notNull().primaryKey(),
  formId: uuid("form_id").references(() => forms.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: varchar("description", { length: 2048 }),
  addAnswersToProfile: boolean("add_questions_to_profile")
    .notNull()
    .default(false),
  order: integer("order").notNull().default(1),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const formChaptersRelations = relations(
  formChapters,
  ({ many, one }) => ({
    form: one(forms, {
      fields: [formChapters.formId],
      references: [forms.id],
    }),
    questions: many(questions),
  })
);

export default formChapters;
