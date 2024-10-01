import { formOptions } from "@tanstack/react-form/nextjs";
import answers from "@/db/schema/answers";

const formOpts = (
  data: typeof answers.$inferInsert & {
    questionType: string;
    singleOption?: string;
    options?: string[];
    answer?: string;
  }
) =>
  formOptions({
    defaultValues: {
      code: data.code,
      questionId: data.questionId,
      questionType: data.questionType,
      text: data.text ?? "",
      score: data.score ?? "",
      singleOption: data.singleOption ?? "",
      options: data.options ?? [],
      answer: data.answer ?? "",
    },
  });

export default formOpts;
