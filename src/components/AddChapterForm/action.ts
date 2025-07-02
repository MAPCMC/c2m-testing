"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { formChapters } from "@/db/schema";
import formOpts from "./formOptions";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts(""),
  onServerValidate: ({ value }) => {
    if (!value.formId) {
      return "Formulier bestaat niet";
    }

    if (!value.title || !value.order) {
      return "Vul alle velden in";
    }
  },
});

const handleSubmit = async (values: {
  title: string;
  description: string;
  formId: string;
  addAnswersToProfile: boolean;
  order: number;
}) => {
  try {
    const result = await db
      .insert(formChapters)
      .values({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        addAnswersToProfile: values.addAnswersToProfile,
        order: values.order,
        formId: values.formId || null,
      })
      .returning();

    if (result[0]?.id) {
      return result[0];
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
};

export async function handleAddFormSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    const validatedData = await serverValidate(formData);
    const result = await handleSubmit(validatedData);

    if (
      result &&
      "id" in result &&
      typeof result.id === "number"
    ) {
      redirect(
        `/admin/forms/${result.formId}/chapter/${result.id}/edit`
      );
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
