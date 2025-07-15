"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { options, questionsToOptions } from "@/db/schema";
import formOpts from "./formOptions";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (!value.text || !value.value) {
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
      text: formData.get("text")?.toString() ?? "",
      value: formData.get("value")?.toString() ?? "",
      formId: formData.get("formId")?.toString() ?? "",
      chapterId:
        formData.get("chapterId")?.toString() ?? "",
      questionId:
        formData.get("questionId")?.toString() ?? "",
    };

    const result = await db
      .insert(options)
      .values({
        ...values,
        text: values.text.trim(),
        value: values.value
          .trim()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, ""),
      })
      .returning();

    if (result) {
      const link = await db
        .insert(questionsToOptions)
        .values({
          optionId: result[0].id,
          questionId: Number(values.questionId),
        })
        .returning();

      if (link) {
        redirect(
          `/admin/forms/${values.formId}/chapter/${values.chapterId}/question/${values.questionId}/edit`
        );
      }
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
