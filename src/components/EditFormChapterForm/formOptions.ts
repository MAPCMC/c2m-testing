import { formOptions } from "@tanstack/react-form/nextjs";
import { formChapters } from "@/db/schema";

const formOpts = (
  formChapter: Omit<
    typeof formChapters.$inferSelect,
    "order"
  >
) => {
  return formOptions({
    defaultValues: {
      id: formChapter.id,
      title: formChapter.title ?? "",
      description: formChapter.description ?? "",
      addAnswersToProfile:
        formChapter.addAnswersToProfile ?? false,
      formId: formChapter.formId,
    },
  });
};

export default formOpts;
