"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { options } from "@/db/schema";
import formOpts from "./formOptions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts({
    id: 0, // dummy values to satisfy the type system
    text: "",
    value: "",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Optie bestaat niet";
    }

    if (!value.text || !value.value) {
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
      text: formData.get("text")?.toString() ?? "",
      value: formData.get("value")?.toString() ?? "",
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
      .update(options)
      .set({
        ...values,
        text: values.text.trim(),
        value: values.value.trim(),
        id: Number(values.id),
      })
      .where(eq(options.id, Number(values.id)))
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
