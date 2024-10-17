import { pgTable, char, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import users from "./users";
import forms from "./forms";

const codes = pgTable("code", {
  createdById: uuid("created_by_id").references(
    () => users.id,
    {
      onDelete: "cascade",
    }
  ),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  link: char("link", { length: 10 })
    .notNull()
    .unique()
    .primaryKey(),
});

export const codesRelations = relations(
  codes,
  ({ one }) => ({
    user: one(users, {
      fields: [codes.userId],
      references: [users.id],
      relationName: "user",
    }),
  })
);

export default codes;
