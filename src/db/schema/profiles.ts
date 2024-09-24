import {
  pgTable,
  text,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import users from "./users";

const profiles = pgTable("profile", {
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  textSize: text("text_size", {
    enum: ["small", "medium", "large"],
  }).default("small"),
  language: text("language").notNull().default("nl"),
  theme: text("theme").notNull().default("light"),
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

export default profiles;
