"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import formOpts from "./formOptions";
import db from "@/db";
import { apps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts({
    id: "",
    name: "",
    link: "",
    description: "",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Er is iets misgegaan. Neem contact op met de beheerder.";
    }
    if (!value.name || !value.link) {
      return "Vul alle velden in";
    }
  },
});

export default async function handleAddAppSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);

    const formId = formData.get("id")?.toString();

    if (!formId) {
      throw new Error("Form id not found");
    }

    const app = await db
      .update(apps)
      .set({
        name: formData.get("name")?.toString() ?? "",
        link: formData.get("link")?.toString() ?? "",
        description:
          formData.get("description")?.toString() ?? "",
      })
      .where(eq(apps.id, formId))
      .returning();

    if (!app?.length) {
      throw new Error("Failed to update app");
    } else {
      redirect("/admin/apps");
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}
