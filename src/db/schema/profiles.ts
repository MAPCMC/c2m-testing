import {
  pgTable,
  text,
  uuid,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import users from "./users";
import answers from "./answers";

const profiles = pgTable("profile", {
  id: serial("id").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  textSize: text("text_size", {
    enum: ["small", "medium", "large"],
  }).default("small"),
  language: text("language", {
    enum: ["nl", "en"],
  })
    .notNull()
    .default("nl"),
  theme: text("theme", {
    enum: ["light", "dark"],
  })
    .notNull()
    .default("light"),
  screenReaderOptimized: boolean("screen_reader_optimized")
    .notNull()
    .default(false),
  feedbackEnabled: boolean("feedback_enabled")
    .notNull()
    .default(false),
  readingEnabled: boolean("reading_enabled")
    .notNull()
    .default(false),
});

export const profilesRelations = relations(
  profiles,
  ({ many }) => ({
    answers: many(answers),
  })
);

export default profiles;
