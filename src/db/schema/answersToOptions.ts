import {
  integer,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import options from "./options";
import answers from "./answers";

export const answersToOptions = pgTable(
  "answers_to_options",
  {
    answerId: integer("answer_id")
      .notNull()
      .references(() => answers.id),
    optionId: integer("option_id")
      .notNull()
      .references(() => options.id),
    explanation: text("explanation"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.answerId, t.optionId] }),
  })
);

export const answersToOptionsRelations = relations(
  answersToOptions,
  ({ one }) => ({
    option: one(options, {
      fields: [answersToOptions.optionId],
      references: [options.id],
    }),
    answer: one(answers, {
      fields: [answersToOptions.answerId],
      references: [answers.id],
    }),
  })
);

export default answersToOptions;
