"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { questions } from "@/db/schema";
import formOpts from "./formOptions";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (!value.chapterId || !value.formId) {
      return "Formulier of hoofdstuk bestaat niet";
    }

    if (!value.label || !value.key) {
      return "Vul alle velden in";
    }
  },
});

export async function handleAddFormQuestionSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);

    const values = {
      label: formData.get("label")?.toString() ?? "",
      key: formData.get("key")?.toString() ?? "",
      description:
        formData.get("description")?.toString() ?? "",
      order: formData.get("order")?.toString() ?? "",
      formChapterId:
        formData.get("chapterId")?.toString() ?? "",
      scoreHighDescription:
        formData.get("scoreHighDescription")?.toString() ??
        "",
      scoreLowDescription:
        formData.get("scoreLowDescription")?.toString() ??
        "",
      type: formData.get("type")?.toString() ?? "",
      formId: formData.get("formId")?.toString() ?? "",
    };

    if (!values.formChapterId) {
      throw new Error(
        "Formulier of hoofdstuk bestaat niet"
      );
    }

    const result = await db
      .insert(questions)
      .values({
        key: values.key.trim(),
        label: values.label.trim(),
        description: values.description.trim(),
        type: values.type as
          | "number"
          | "text"
          | "score"
          | "textarea"
          | "multiple"
          | "multiple_explained"
          | "selection"
          | undefined,
        order: Number(values.order),
        score_high_description:
          values.scoreHighDescription.trim(),
        score_low_description:
          values.scoreLowDescription.trim(),
        formChapterId: Number(values.formChapterId),
      })
      .returning();

    if (result[0]?.id) {
      redirect(
        `/admin/forms/${values.formId}/chapter/${values.formChapterId}/question/${result[0].id}/edit`
      );
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
