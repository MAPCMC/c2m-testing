import {
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import questionsToOptions from "./questionsToOptions";
import forms from "./forms";

const questions = pgTable("question", {
  id: serial("id").notNull().primaryKey(),
  key: text("key").notNull().unique(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, {
      onDelete: "cascade",
    }),
  text: text("text"),
  description: text("description"),
  type: text("type", {
    enum: [
      "text",
      "textarea",
      "score",
      "selection",
      "multiple",
    ],
  })
    .notNull()
    .default("text"),
  score: text("score", { enum: ["1", "2", "3", "4", "5"] }),
  score_high_description: text("score_high_description"),
  score_low_description: text("grade_low_description"),
});

export const questionsRelations = relations(
  questions,
  ({ many, one }) => ({
    form: one(forms, {
      fields: [questions.formId],
      references: [forms.id],
    }),
    questionsToOptions: many(questionsToOptions),
  })
);

export default questions;
