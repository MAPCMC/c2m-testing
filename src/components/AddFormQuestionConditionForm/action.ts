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
      !value.field ||
      !value.operator ||
      !value.requirement
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
    await serverValidate(formData);

    const values = {
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

    const result = await db
      .insert(questionConditions)
      .values({
        ...values,
        field: values.field as "text" | "score" | "options",
        operator: values.operator as
          | "contains"
          | "equals"
          | "not contains"
          | "not equals",
        requirement: values.requirement,
        questionId: Number(values.questionId),
      })
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
