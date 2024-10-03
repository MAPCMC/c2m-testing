"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { eq } from "drizzle-orm";
import { answers, answersToOptions } from "@/db/schema";
import formOptions from "./formOptions";

const serverValidate = createServerValidate({
  ...formOptions({
    code: "fda",
    question: {
      id: 1,
      description: "test",
      formChapterId: 1,
      order: 1,
      label: "test",
      type: "text",
      key: "test",
      score_high_description: null,
      score_low_description: null,
      questionsToOptions: [],
    },
    answer: {
      id: 1,
      code: "fda",
      questionKey: "test",
      text: null,
      score: null,
      profileId: null,
      answersToOptions: [],
    },
  }),
  onServerValidate: ({ value }) => {
    if (
      value.questionType === "multiple" &&
      !value.optionsString
    ) {
      return "Opties worden niet gelezen. Neem contact op met de beheerder.";
    }

    if (
      value.questionType === "score" &&
      !!value.score &&
      !["1", "2", "3", "4", "5"].includes(value.score)
    ) {
      return "Score moet tussen 1 en 5 liggen.";
    }

    if (!value.questionKey || !value.code) {
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
  const scoreValue =
    formData.get("score")?.toString() ?? null;
  const score: "1" | "2" | "3" | "4" | "5" | null =
    scoreValue &&
    ["1", "2", "3", "4", "5"].includes(scoreValue)
      ? (scoreValue as "1" | "2" | "3" | "4" | "5")
      : null;

  const values: typeof answers.$inferInsert = {
    questionKey:
      formData.get("questionKey")?.toString() ?? null,
    code: formData.get("code")?.toString() ?? "",
    text: formData.get("text")?.toString() ?? null,
    score: score,
  };

  const currentAnswerId = formData.get("currentAnswerId");

  const addNewOptions = async (answerId: number) => {
    const newOptionsString =
      formData.get("optionsString")?.toString() ?? "";
    const newOptions: Array<{
      explanation: string;
      value: string;
    }> = newOptionsString
      ? JSON.parse(newOptionsString)
      : [];

    const newOption = formData.get("singleOption");

    if (newOptions.length || !!newOption) {
      if (formData.get("questionType") === "multiple") {
        // Add new options
        await db.insert(answersToOptions).values(
          newOptions.map((option) => ({
            answerId: answerId,
            optionId: Number(option.value),
            explanation: option.explanation,
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
        questionKey: values.questionKey,
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
