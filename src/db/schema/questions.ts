import {
  pgTable,
  serial,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import questionsToOptions from "./questionsToOptions";
import formChapters from "./formChapters";
import questionConditions from "./questionConditions";

const questions = pgTable("question", {
  id: serial("id").notNull().primaryKey(),
  key: text("key").notNull().unique(),
  formChapterId: integer("form_chapter_id")
    .notNull()
    .references(() => formChapters.id, {
      onDelete: "cascade",
    }),
  label: text("label").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(1),
  type: text("type", {
    enum: [
      "text",
      "textarea",
      "score",
      "selection",
      "multiple",
      "number",
    ],
  })
    .notNull()
    .default("text"),
  score_high_description: text("score_high_description"),
  score_low_description: text("score_low_description"),
});

export const questionsRelations = relations(
  questions,
  ({ many, one }) => ({
    formChapter: one(formChapters, {
      fields: [questions.formChapterId],
      references: [formChapters.id],
    }),
    questionsToOptions: many(questionsToOptions),
    questionConditions: many(questionConditions, {
      relationName: "question",
    }),
  })
);

export default questions;
