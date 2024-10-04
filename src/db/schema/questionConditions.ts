import {
  pgTable,
  serial,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import questions from "./questions";

const questionConditions = pgTable("question_conditions", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(
    () => questions.id,
    {
      onDelete: "cascade",
    }
  ),
  key: text("key")
    .notNull()
    .references(() => questions.key, {
      onDelete: "cascade",
    }),
  field: text("field", {
    enum: ["text", "score", "options"],
  }),
  operator: text("operator", {
    enum: [
      "equals",
      "not equals",
      "contains",
      "not contains",
    ],
  }),
  requirement: text("requirement"),
});

export const questionConditionsRelations = relations(
  questionConditions,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionConditions.questionId],
      references: [questions.id],
      relationName: "question",
    }),
    key: one(questions, {
      fields: [questionConditions.key],
      references: [questions.key],
    }),
  })
);

export default questionConditions;
