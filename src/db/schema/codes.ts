import { pgTable, char, uuid } from "drizzle-orm/pg-core";
import users from "./users";
import forms from "./forms";

const codes = pgTable("code", {
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  link: char("link", { length: 10 }).notNull().unique(),
});

export default codes;
