import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env/server";
import * as schema from "./schema/index";

const max = 10;

const client =
  globalThis.__POSTGRES__ ??
  postgres(env.DB_URL, {
    max,
    idle_timeout: 60,
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
