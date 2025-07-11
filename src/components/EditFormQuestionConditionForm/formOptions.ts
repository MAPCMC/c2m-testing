import { formOptions } from "@tanstack/react-form/nextjs";
import { questionConditions } from "@/db/schema";

const formOpts = (
  condition: typeof questionConditions.$inferSelect
) => {
  return formOptions({
    defaultValues: {
      id: condition.id,
      key: condition.key ?? "",
      questionId: condition.questionId ?? null,
      formId: "",
      chapterId: "",
      field: condition.field ?? "_none",
      operator: condition.operator ?? "_none",
      requirement: condition.requirement ?? "_none",
    },
  });
};

export default formOpts;
