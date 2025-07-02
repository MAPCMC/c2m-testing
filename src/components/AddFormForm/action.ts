"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { forms } from "@/db/schema";
import formOpts from "./formOptions";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (!value.title || !value.appId) {
      return "Vul alle velden in";
    }
  },
});

const handleSubmit = async (values: {
  title: string;
  description: string;
  appId: string;
}) => {
  try {
    const result = await db
      .insert(forms)
      .values({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        appId: values.appId || null,
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
      typeof result.id === "string"
    ) {
      redirect(`/admin/forms/${result.id}/edit`);
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
