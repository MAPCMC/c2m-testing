import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env/server";
import * as schema from "./schema/index";

const connectionString = env.DB_URL;

const client = postgres(connectionString);
const db = drizzle(client, {
  schema: schema,
});

export default db;
