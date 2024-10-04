import db from "@/db";
import { eq } from "drizzle-orm";
import { answers, answersToOptions } from "@/db/schema";
import { addNewOptions } from "./addNewOptions";

export const updateAnswer = async (
  formData: FormData,
  values: typeof answers.$inferInsert & {
    formId: string;
  },
  currentAnswerId: string | null
) => {
  if (currentAnswerId) {
    const existingAnswer = await db.query.answers.findFirst(
      {
        where: eq(answers.id, Number(currentAnswerId)),
        with: {
          answersToOptions: {
            with: {
              option: true,
            },
          },
        },
      }
    );

    if (!existingAnswer) {
      throw new Error("Answer not found");
    }

    // Update if changes are made
    if (
      existingAnswer.text !== values.text ||
      existingAnswer.score !== values.score
    ) {
      await db
        .update(answers)
        .set({ text: values.text, score: values.score })
        .where(eq(answers.id, existingAnswer.id));
    }

    // Remove existing options
    const existingOptions =
      existingAnswer?.answersToOptions ?? [];
    if (existingOptions.length) {
      await db
        .delete(answersToOptions)
        .where(
          eq(answersToOptions.answerId, existingAnswer.id)
        );
    }

    // Add new options
    await addNewOptions(formData, existingAnswer.id);
  } else {
    // Create a new answer
    const newAnswer = await db
      .insert(answers)
      .values({
        questionKey: values.questionKey,
        code: values.code,
        text: values.text,
        score: values.score,
      })
      .returning();

    if (!newAnswer?.length)
      throw new Error(
        "Failed to create new answer options"
      );
    await addNewOptions(formData, newAnswer[0].id);
  }
};
