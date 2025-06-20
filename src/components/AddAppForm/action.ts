"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import formOpts from "./formOptions";
import db from "@/db";
import { apps } from "@/db/schema";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
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

    const app = await db
      .insert(apps)
      .values({
        name: formData.get("name")?.toString() ?? "",
        link: formData.get("link")?.toString() ?? "",
        description:
          formData.get("description")?.toString() ?? "",
      })
      .returning();

    if (!app?.length) {
      throw new Error("Failed to create app");
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
