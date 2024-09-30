import {
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import codes from "./codes";
import questions from "./questions";
import profiles from "./profiles";
import answersToOptions from "./answersToOptions";

const answers = pgTable("answer", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "no action",
    }),
  profileId: integer("profile_id").references(
    () => profiles.id,
    {
      onDelete: "no action",
    }
  ),
  code: text("code")
    .notNull()
    .references(() => codes.link, {
      onDelete: "no action",
    }),
  text: text("text"),
  score: text("score"),
});

export const answersRelations = relations(
  answers,
  ({ many, one }) => ({
    profile: one(profiles, {
      fields: [answers.profileId],
      references: [profiles.id],
    }),
    answersToOptions: many(answersToOptions),
  })
);

export default answers;
