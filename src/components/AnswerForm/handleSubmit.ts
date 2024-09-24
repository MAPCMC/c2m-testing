"use server";
// import db from '@/db';
import answerSchema from "./answerSchema";
import { z } from "zod";

import db from "@/db";
import { eq, and } from "drizzle-orm";
import { answers } from "@/db/schema";

export async function onSubmit(formData: FormData) {
  if (
    !formData.get("questionId") ||
    !formData.get("code")
  ) {
    throw new Error("Data error");
  }

  const values: z.infer<typeof answerSchema> = {
    questionId: Number(formData.get("questionId")),
    code: formData.get("code")?.toString() ?? "",
    // options: formData.get("options"),
    text: formData.get("text")?.toString() ?? undefined,
  };

  const existingAnswer = await db.query.answers.findFirst({
    where: and(
      eq(answers.code, values.code),
      eq(answers.questionId, values.questionId)
    ),
  });

  if (existingAnswer) {
    if (
      !!values.text &&
      existingAnswer.text !== values.text
    ) {
      await db
        .update(answers)
        .set({ text: values.text })
        .where(
          and(
            eq(answers.code, values.code),
            eq(answers.questionId, values.questionId)
          )
        );
    }
  } else {
    await db
      .insert(answers)
      .values({
        questionId: values.questionId,
        code: values.code,
        text: values.text,
      })
      .returning();
  }
}
