"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import {
  apps as appsSchema,
  questionConditions as questionConditionsSchema,
  questions as questionsSchema,
  options as optionsSchema,
  forms as formsSchema,
  formChapters as formChaptersSchema,
} from "@/db/schema";

export async function handleRemove(
  schemaName: string,
  id: string | number
) {
  const schemas = (schemaName: string) => {
    if (schemaName === "apps") return appsSchema;
    if (schemaName === "question_conditions")
      return questionConditionsSchema;
    if (schemaName === "forms") return formsSchema;
    if (schemaName === "questions") return questionsSchema;
    if (schemaName === "options") return optionsSchema;
    if (schemaName === "form_chapters")
      return formChaptersSchema;
    return null;
  };

  const schema = schemas(schemaName);

  if (!schema) {
    throw new Error(
      "Schema not found: check handleRemove of RemoveButton"
    );
  }

  if (
    schemaName === "form_chapters" ||
    schemaName === "forms" ||
    schemaName === "questions"
  ) {
    try {
      await db
        .update(
          schema as
            | typeof formChaptersSchema
            | typeof questionsSchema
            | typeof formsSchema
        )
        .set({ deletedAt: new Date() })
        .where(eq(schema.id, id));
    } catch (e) {
      console.error(e);
      throw new Error("Failed to delete");
    }
    return;
  }

  try {
    await db.delete(schema).where(eq(schema.id, id));
  } catch (e) {
    console.error(e);
    throw new Error("Failed to remove");
  }
}
