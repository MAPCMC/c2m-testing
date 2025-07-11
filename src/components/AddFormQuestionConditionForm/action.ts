"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { questionConditions } from "@/db/schema";
import formOpts from "./formOptions";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (
      !value.key ||
      value.key === "_none" ||
      !value.field ||
      value.field === "_none" ||
      !value.operator ||
      value.operator === "_none" ||
      !value.requirement ||
      value.requirement === "_none"
    ) {
      return "Vul alle velden in";
    }
  },
});

export async function handleAddFormSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    const validatedData = await serverValidate(formData);

    const result = await db
      .insert(questionConditions)
      .values({
        ...validatedData,
        field: validatedData.field as
          | "text"
          | "score"
          | "options",
        operator: validatedData.operator as
          | "contains"
          | "equals"
          | "not contains"
          | "not equals",
        requirement: validatedData.requirement,
        questionId: Number(validatedData.questionId),
      })
      .returning();

    if (result) {
      redirect(
        `/admin/forms/${validatedData.formId}/chapter/${validatedData.chapterId}/question/${validatedData.questionId}/edit`
      );
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
