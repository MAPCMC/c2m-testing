import {
  integer,
  pgTable,
  serial,
  text,
  char,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import codes from "./codes";
import questions from "./questions";
import profiles from "./profiles";
import answersToOptions from "./answersToOptions";

const answers = pgTable("answer", {
  id: serial("id").primaryKey(),
  questionKey: text("question_key").references(
    () => questions.key,
    {
      onDelete: "no action",
    }
  ),
  profileId: integer("profile_id").references(
    () => profiles.id,
    {
      onDelete: "set null",
    }
  ),
  code: char("code", { length: 10 })
    .notNull()
    .references(() => codes.link, {
      onDelete: "no action",
    }),
  text: text("text"),
  score: text("score", {
    enum: ["1", "2", "3", "4", "5", "nvt"],
  }),
});

export const answersRelations = relations(
  answers,
  ({ many, one }) => ({
    question: one(questions, {
      fields: [answers.questionKey],
      references: [questions.key],
    }),
    profile: one(profiles, {
      fields: [answers.profileId],
      references: [profiles.id],
    }),
    code: one(codes, {
      fields: [answers.code],
      references: [codes.link],
    }),
    answersToOptions: many(answersToOptions),
  })
);

export default answers;
