import { pgTable, serial, text } from "drizzle-orm/pg-core";

const questions = pgTable("question", {
  id: serial("id").notNull().primaryKey(),
  text: text("text"),
});

export default questions;
