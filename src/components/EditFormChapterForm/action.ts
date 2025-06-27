"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { formChapters } from "@/db/schema";
import formOpts from "./formOptions";
import { eq } from "drizzle-orm";

const serverValidate = createServerValidate({
  ...formOpts({
    id: 0, // dummy values to satisfy the type system
    title: "",
    description: "",
    addAnswersToProfile: false,
    order: 0,
    formId: "",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id || !value.formId) {
      return "Formulier bestaat niet";
    }

    if (!value.title) {
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
      title: formData.get("title")?.toString() ?? "",
      description:
        formData.get("description")?.toString() ?? "",
      addAnswersToProfile:
        formData.get("addAnswersToProfile") ?? false,
      order: formData.get("order")?.toString() ?? "",
      formId: formData.get("formId")?.toString() ?? "",
      id: formData.get("id")?.toString(),
    };

    if (!values.id) {
      throw new Error("Formulier bestaat niet");
    }

    return await db
      .update(formChapters)
      .set({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        addAnswersToProfile: values.addAnswersToProfile,
        order: Number(values.order),
        formId: values.formId,
      })
      .where(eq(formChapters.id, values.id))
      .returning();
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
