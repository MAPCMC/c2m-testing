import {
  timestamp,
  pgTable,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  role: text("role")
    .$type<"admin" | "superuser" | "user">()
    .default("user"),
  email: varchar("email", { length: 320 })
    .notNull()
    .unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }),
  image: varchar("image", { length: 2048 }),
});

export default users;
