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
    const validatedData = await serverValidate(formData);

    if (!validatedData.id) {
      throw new Error("Formulier bestaat niet");
    }

    return await db
      .update(formChapters)
      .set({
        ...validatedData,
        title: validatedData.title.trim(),
        description: validatedData.description.trim(),
        addAnswersToProfile:
          validatedData.addAnswersToProfile ?? false,
        order: Number(validatedData.order),
        formId: validatedData.formId,
      })
      .where(eq(formChapters.id, validatedData.id))
      .returning();
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
