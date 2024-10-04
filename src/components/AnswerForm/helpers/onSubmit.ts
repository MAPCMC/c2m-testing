import { answers } from "@/db/schema";
import { updateAnswer } from "./updateAnswer";
import { afterAnswerUpdate } from "./afterAnswerUpdate";

export async function onSubmit(formData: FormData) {
  const scoreValue =
    formData.get("score")?.toString() ?? null;
  const score: "1" | "2" | "3" | "4" | "5" | "nvt" | null =
    scoreValue &&
    ["1", "2", "3", "4", "5", "nvt"].includes(scoreValue)
      ? (scoreValue as "1" | "2" | "3" | "4" | "5" | "nvt")
      : null;

  const values: typeof answers.$inferInsert & {
    formId: string;
  } = {
    questionKey:
      formData.get("questionKey")?.toString() ?? null,
    formId: formData.get("formId")?.toString() ?? "",
    code: formData.get("code")?.toString() ?? "",
    text: formData.get("text")?.toString() ?? null,
    score: score,
  };

  const currentAnswerId =
    formData.get("currentAnswerId")?.toString() ?? null;

  // Update or insert answer
  await updateAnswer(formData, values, currentAnswerId);

  // Redirect to next question
  await afterAnswerUpdate(formData, values);
}
