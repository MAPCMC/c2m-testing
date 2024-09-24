import {
  char,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: varchar("description", { length: 2048 }),
  code: char("code", { length: 8 }).notNull().unique(),
});

export default forms;
