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
      !value.field ||
      !value.operator ||
      !value.requirement
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
    await serverValidate(formData);

    const values = {
      id: formData.get("id")?.toString() ?? "",
      key: formData.get("key")?.toString() ?? "",
      field: formData.get("field")?.toString() ?? "",
      operator: formData.get("operator")?.toString() ?? "",
      requirement:
        formData.get("requirement")?.toString() ?? "",
      formId: formData.get("formId")?.toString() ?? "",
      chapterId:
        formData.get("chapterId")?.toString() ?? "",
      questionId:
        formData.get("questionId")?.toString() ?? "",
    };

    if (!values.id) {
      throw new Error("Optie bestaat niet");
    }

    const result = await db
      .update(questionConditions)
      .set({
        ...values,
        field: values.field as "text" | "score" | "options",
        operator: values.operator as
          | "contains"
          | "equals"
          | "not contains"
          | "not equals",
        requirement: values.requirement,
        id: Number(values.id),
        questionId: Number(values.questionId),
      })
      .where(eq(questionConditions.id, Number(values.id)))
      .returning();

    if (result) {
      redirect(
        `/admin/forms/${values.formId}/chapter/${values.chapterId}/question/${values.questionId}/edit`
      );
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
