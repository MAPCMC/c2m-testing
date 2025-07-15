"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import {
  questionsToOptions,
  options as optionsSchema,
} from "@/db/schema";

export async function removeOption(id: string | number) {
  if (typeof id !== "number") {
    throw new Error("Id klopt niet");
  }
  try {
    await db
      .delete(questionsToOptions)
      .where(eq(questionsToOptions.optionId, id));

    const answeredOption =
      await db.query.answersToOptions.findFirst({
        where: (a, { eq }) => eq(a.optionId, id),
      });

    if (!answeredOption) {
      await db
        .delete(optionsSchema)
        .where(eq(optionsSchema.id, id));
    }
  } catch (e) {
    console.error(e);
    throw new Error("Kan optie niet verwijderen");
  }
}
