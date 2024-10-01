import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import questionsToOptions from "./questionsToOptions";
import answersToOptions from "./answersToOptions";

const options = pgTable("option", {
  id: serial("id").notNull().primaryKey(),
  text: text("text"),
  value: text("value").notNull(),
});

export const optionsRelations = relations(
  options,
  ({ many }) => ({
    questionsToOptions: many(questionsToOptions),
    answersToOptions: many(answersToOptions),
  })
);

export default options;
