import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env/server";

const connectionString = env.DB_URL;

const client = postgres(connectionString);
const db = drizzle(client);

export default db;
