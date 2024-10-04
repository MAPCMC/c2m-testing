import db from "@/db";
import { answersToOptions } from "@/db/schema";

export const addNewOptions = async (
  formData: FormData,
  answerId: number
) => {
  const newOptionsString =
    formData.get("optionsString")?.toString() ?? "";
  const newOptions: Array<{
    explanation: string;
    value: string;
  }> = newOptionsString ? JSON.parse(newOptionsString) : [];
  const newOption = formData.get("singleOption");

  if (newOptions.length || !!newOption) {
    if (formData.get("questionType") === "multiple") {
      await db.insert(answersToOptions).values(
        newOptions.map((option) => ({
          answerId: answerId,
          optionId: Number(option.value),
          explanation: option.explanation,
        }))
      );
    }

    if (
      formData.get("questionType") === "selection" &&
      !!newOption
    ) {
      await db.insert(answersToOptions).values({
        answerId: answerId,
        optionId: Number(formData.get("singleOption")),
      });
    }
  }
};
