import {
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import codes from "./codes";
import questions from "./questions";

const answers = pgTable("answer", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: serial("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "cascade",
    }),
  code: text("code")
    .notNull()
    .references(() => codes.link, { onDelete: "cascade" }),
  text: text("text"),
});

export default answers;
