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
      field: condition.field ?? null,
      operator: condition.operator ?? null,
      requirement: condition.requirement ?? null,
    },
  });
};

export default formOpts;
