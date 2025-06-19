"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { forms } from "@/db/schema";
import formOpts from "./formOptions";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: async ({ value }) => {
    if (!value.title || !value.appId) {
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
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}

export const handleSubmit = async (values: {
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
      console.log(result);
      return result;
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    return {
      error:
        "Er is een fout opgetreden bij het aanmaken van het formulier",
    };
  }
};
