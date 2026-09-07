import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env/server";
import * as schema from "./schema/index";

const client =
  globalThis.__POSTGRES__ ??
  postgres(env.DB_URL, {
    // Vercel functions use Supabase's transaction pooler.
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__POSTGRES__ = client;
}

const db = drizzle(client, { schema });

export default db;

declare global {
  // eslint-disable-next-line no-var
  var __POSTGRES__: ReturnType<typeof postgres> | undefined;
}
