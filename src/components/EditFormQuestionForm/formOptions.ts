import { formOptions } from "@tanstack/react-form/nextjs";
import { questions } from "@/db/schema";

const formOpts = (
  question: Omit<
    typeof questions.$inferSelect,
    "key" | "order" | "deletedAt"
  >
) => {
  return formOptions({
    defaultValues: {
      id: question.id,
      formChapterId: question.formChapterId,
      label: question.label ?? "",
      description: question.description ?? "",
      type: question.type,
      scoreHighDescription:
        question.score_high_description ?? "",
      scoreLowDescription:
        question.score_low_description ?? "",
    },
  });
};

export default formOpts;
