"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import { apps as appsSchema } from "@/db/schema";

export async function handleRemove(
  schemaName: string,
  id: string
) {
  const schemas = (schemaName: string) => {
    if (schemaName === "apps") return appsSchema;
    return null;
  };

  const schema = schemas(schemaName);

  if (!schema) {
    throw new Error("Schema not found");
  }

  try {
    await db.delete(schema).where(eq(schema.id, id));
  } catch (e) {
    console.error(e);
    throw new Error("Failed to remove");
  }
}
