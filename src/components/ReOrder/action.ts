"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import { formChapters, questions } from "@/db/schema";

export async function handleOrder({
  id,
  order,
  schemaName,
}: {
  id: number;
  order: number;
  schemaName: "form_chapters" | "questions";
}) {
  const schemas = (
    schemaName: "form_chapters" | "questions"
  ) => {
    if (schemaName === "form_chapters") return formChapters;
    if (schemaName === "questions") return questions;
    return null;
  };

  const schema = schemas(schemaName);

  if (!schema) {
    throw new Error("Schema not found");
  }

  try {
    await db
      .update(schema)
      .set({ order })
      .where(eq(schema.id, id));

    return "ok";
  } catch (e) {
    console.error(e);
    throw new Error("Failed to update order");
  }
}
