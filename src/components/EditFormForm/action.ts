"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { forms } from "@/db/schema";
import formOpts from "./formOptions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts({
    id: "", // dummy values to satisfy the type system
    title: "",
    description: "",
    appId: "",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Formulier bestaat niet";
    }

    if (!value.title || !value.appId) {
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
      appId: formData.get("appId")?.toString() ?? "",
      id: formData.get("id")?.toString(),
    };

    if (!values.id) {
      throw new Error("Formulier bestaat niet");
    }

    const result = await db
      .update(forms)
      .set({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        appId: values.appId || null,
      })
      .where(eq(forms.id, values.id))
      .returning();

    if (result) {
      redirect(`/admin/forms`);
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
