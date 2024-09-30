import {
  integer,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import options from "./options";
import questions from "./questions";

export const questionsToOptions = pgTable(
  "questions_to_options",
  {
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
    optionId: integer("option_id")
      .notNull()
      .references(() => options.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.questionId, t.optionId] }),
  })
);

export const questionsToOptionsRelations = relations(
  questionsToOptions,
  ({ one }) => ({
    option: one(options, {
      fields: [questionsToOptions.optionId],
      references: [options.id],
    }),
    question: one(questions, {
      fields: [questionsToOptions.questionId],
      references: [questions.id],
    }),
  })
);

export default questionsToOptions;
