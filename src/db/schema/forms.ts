import {
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import questions from "./questions";

const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: varchar("description", { length: 2048 }),
});

export const formsRelations = relations(
  forms,
  ({ many }) => ({
    questions: many(questions),
  })
);

export default forms;
