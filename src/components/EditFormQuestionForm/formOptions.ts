import { formOptions } from "@tanstack/react-form/nextjs";
import { questions } from "@/db/schema";

const formOpts = (
  question: typeof questions.$inferSelect
) => {
  return formOptions({
    defaultValues: {
      id: question.id,
      key: question.key,
      label: question.label ?? "",
      description: question.description ?? "",
      order: question.order,
      type: question.type,
      scoreHighDescription:
        question.score_high_description ?? "",
      scoreLowDescription:
        question.score_low_description ?? "",
    },
  });
};

export default formOpts;
