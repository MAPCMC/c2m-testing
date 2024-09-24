"use server";
// import db from '@/db';
import answerSchema from "./answerSchema";
import { z } from "zod";

export async function onSubmit(
  values: z.infer<typeof answerSchema>
) {
  console.log(values);
  // const result = await db.
}
