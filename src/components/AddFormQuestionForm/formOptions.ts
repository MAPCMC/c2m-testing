import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = formOptions({
  defaultValues: {
    key: "",
    label: "",
    description: "",
    order: 0,
    type: "text",
    scoreHighDescription: "",
    scoreLowDescription: "",
    chapterId: "",
    formId: "",
  },
});

export default formOpts;
