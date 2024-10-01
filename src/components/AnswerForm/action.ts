"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { eq } from "drizzle-orm";
import { answers, answersToOptions } from "@/db/schema";
import { revalidateTag } from "next/cache";

const serverValidate = createServerValidate({
  onServerValidate: async ({
    value,
  }: {
    value: typeof answers.$inferInsert;
  }) => {
    if (!value.questionId || !value.code) {
      return "Kan vraag niet beantwoorden. Neem contact op met de beheerder.";
    }
  },
});

export default async function handleAnswerFormSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);
    await onSubmit(formData);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}

export async function onSubmit(formData: FormData) {
  const values: typeof answers.$inferInsert = {
    questionId: Number(formData.get("questionId")),
    code: formData.get("code")?.toString() ?? "",
    text: formData.get("text")?.toString() ?? null,
    score: formData.get("score")?.toString() ?? null,
  };

  const currentAnswerId = formData.get("currentAnswerId");

  const addNewOptions = async (answerId: number) => {
    const newOptions = formData.getAll("options");
    const newOption = formData.get("singleOption");

    if (newOptions.length || !!newOption) {
      if (formData.get("questionType") === "multiple") {
        // Add new options
        await db.insert(answersToOptions).values(
          newOptions.map((optionId) => ({
            answerId: answerId,
            optionId: Number(optionId),
          }))
        );
      }

      if (
        formData.get("questionType") === "selection" &&
        !!newOption
      ) {
        await db.insert(answersToOptions).values({
          answerId: answerId,
          optionId: Number(formData.get("singleOption")),
        });
      }
    }
  };

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
      // Update the answer
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
    await addNewOptions(existingAnswer.id);
  } else {
    // create a new answer
    const newAnswer = await db
      .insert(answers)
      .values({
        questionId: values.questionId,
        code: values.code,
        text: values.text,
        score: values.score,
      })
      .returning();

    // Add new options
    if (!newAnswer?.length)
      throw new Error(
        "Failed to create new answer options"
      );
    await addNewOptions(newAnswer[0].id);
  }
}
