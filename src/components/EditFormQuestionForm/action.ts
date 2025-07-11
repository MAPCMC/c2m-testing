"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { questions } from "@/db/schema";
import formOpts from "./formOptions";
import { eq } from "drizzle-orm";

const serverValidate = createServerValidate({
  ...formOpts({
    id: 0, // dummy values to satisfy the type system
    label: "",
    key: "",
    description: "",
    order: 0,
    type: "number",
    formChapterId: 0,
    score_high_description: "",
    score_low_description: "",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Formulier vraag bestaat niet";
    }

    if (!value.label || !value.key) {
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
      label: formData.get("label")?.toString() ?? "",
      key: formData.get("key")?.toString() ?? "",
      description:
        formData.get("description")?.toString() ?? "",
      order: formData.get("order")?.toString() ?? "",
      formChapterId:
        formData.get("formChapterId")?.toString() ?? "",
      id: formData.get("id")?.toString() ?? "",
      scoreHighDescription:
        formData.get("scoreHighDescription")?.toString() ??
        "",
      scoreLowDescription:
        formData.get("scoreLowDescription")?.toString() ??
        "",
    };

    if (!values.id || !values.formChapterId) {
      throw new Error("Formulier vraag bestaat niet");
    }

    return await db
      .update(questions)
      .set({
        ...values,
        label: values.label.trim(),
        description: values.description.trim(),
        order: Number(values.order),
        score_high_description:
          values.scoreHighDescription.trim(),
        score_low_description:
          values.scoreLowDescription.trim(),
        id: Number(values.id),
        formChapterId: Number(values.formChapterId),
      })
      .where(eq(questions.id, Number(values.id)))
      .returning();
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
