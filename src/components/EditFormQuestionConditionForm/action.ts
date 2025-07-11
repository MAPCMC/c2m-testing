"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { questionConditions } from "@/db/schema";
import formOpts from "./formOptions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts({
    id: 0, // dummy values to satisfy the type system
    key: "",
    field: null,
    operator: null,
    requirement: null,
    questionId: null,
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Optie bestaat niet";
    }

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

export async function handleEditFormSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    const validatedData = await serverValidate(formData);

    if (!validatedData.id) {
      throw new Error("Optie bestaat niet");
    }

    const result = await db
      .update(questionConditions)
      .set({
        ...validatedData,
        field:
          validatedData.field === "_none"
            ? null
            : (validatedData.field as
                | "text"
                | "score"
                | "options"),
        operator:
          validatedData.operator === "_none"
            ? null
            : (validatedData.operator as
                | "contains"
                | "equals"
                | "not contains"
                | "not equals"),
        requirement:
          validatedData.requirement === "_none"
            ? null
            : validatedData.requirement,
        id: Number(validatedData.id),
        questionId: Number(validatedData.questionId),
      })
      .where(
        eq(questionConditions.id, Number(validatedData.id))
      )
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
