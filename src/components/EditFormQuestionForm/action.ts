"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";

import db from "@/db";
import { questions } from "@/db/schema";
import formOpts from "./formOptions";
import { eq } from "drizzle-orm";

const serverValidate = createServerValidate({
  ...formOpts({
    id: 0, // dummy values to satisfy the type system
    formChapterId: 0,
    label: "",
    description: "",
    type: "text",
    score_high_description: "",
    score_low_description: "",
  }),
  onServerValidate: ({ value }) => {
    if (!value.id) {
      return "Formulier vraag bestaat niet";
    }

    if (!value.label) {
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

    if (!validatedData.id || !validatedData.formChapterId) {
      throw new Error("Formulier vraag bestaat niet");
    }

    return await db
      .update(questions)
      .set({
        ...validatedData,
        label: validatedData.label.trim(),
        description: validatedData.description.trim(),
        score_high_description:
          validatedData.scoreHighDescription.trim(),
        score_low_description:
          validatedData.scoreLowDescription.trim(),
        id: Number(validatedData.id),
        formChapterId: Number(validatedData.formChapterId),
      })
      .where(eq(questions.id, Number(validatedData.id)))
      .returning();
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}
