import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = formOptions({
  defaultValues: {
    key: "",
    questionId: "",
    field: "",
    operator: "",
    requirement: "",
    formId: "",
    chapterId: "",
  },
});

export default formOpts;
