import {
  timestamp,
  pgTable,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: text("role", {
    enum: ["superadmin", "admin", "user", "superuser"],
  })
    .notNull()
    .default("user"),
  email: varchar("email", { length: 320 })
    .notNull()
    .unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "string",
  }),
});

export default users;
