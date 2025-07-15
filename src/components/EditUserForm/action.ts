"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import formOpts from "./formOptions";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts({
    id: "",
    role: "user",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Er is iets misgegaan. Neem contact op met de beheerder.";
    }
    if (!value.role) {
      return "Vul alle velden in";
    }
  },
});

export default async function handleEditUserSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    const validatedData = await serverValidate(formData);

    const userId = validatedData.id;

    if (!userId) {
      throw new Error("User id not found");
    }

    const user = await db
      .update(users)
      .set({
        role: validatedData.role,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!user?.length) {
      throw new Error("Failed to update user");
    } else {
      redirect("/admin/users");
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}
