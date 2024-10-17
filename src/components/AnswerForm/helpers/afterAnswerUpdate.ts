"use server";

import { getFullForm } from "@/lib/getFullForm";
import { redirect } from "next/navigation";
import { QuestionFull } from "@/db/types";
import { answers } from "@/db/schema";

import type { Route } from "next";

export async function afterAnswerUpdate(
  formData: FormData,
  values: typeof answers.$inferInsert & {
    formId: string;
  }
) {
  // update form to get next question
  const updatedForm = await getFullForm(
    values.formId,
    values.code
  );

  if (!updatedForm) {
    throw new Error("Form not found");
  }

  const updatedFormQuestions =
    updatedForm.formChapters.flatMap(
      (chapter) => chapter.questions
    );
  const direction = formData.get("direction");

  if (
    !updatedFormQuestions.length ||
    !direction ||
    !values.questionKey
  ) {
    throw new Error("New question not found");
  }

  if (direction === "next") {
    redirect(
      `/${values.code}/${
        nextQuestionId(
          updatedFormQuestions,
          values.questionKey
        ) ?? "result"
      }` as Route
    );
  } else {
    const prevQuestionId = previousQuestionId(
      updatedFormQuestions,
      values.questionKey
    );

    redirect(
      `/${values.code}${
        prevQuestionId ? `/${prevQuestionId}` : ""
      }` as Route
    );
  }
}

const nextQuestionId = (
  updatedFormQuestions: QuestionFull[],
  questionKey: string
): number | null => {
  const currentQuestionIndex =
    updatedFormQuestions.findIndex(
      (q) => q.key === questionKey
    );
  if (
    currentQuestionIndex <
    updatedFormQuestions.length - 1
  ) {
    return updatedFormQuestions[currentQuestionIndex + 1]
      .id;
  }
  return null;
};

const previousQuestionId = (
  updatedFormQuestions: QuestionFull[],
  questionKey: string
): number | null => {
  const currentQuestionIndex =
    updatedFormQuestions.findIndex(
      (q) => q.key === questionKey
    );

  if (currentQuestionIndex > 0) {
    return updatedFormQuestions[currentQuestionIndex - 1]
      .id;
  }
  return null;
};
