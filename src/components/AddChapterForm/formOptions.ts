import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = (formId: string) =>
  formOptions({
    defaultValues: {
      title: "",
      description: "",
      addAnswersToProfile: false,
      order: 0,
      formId: formId,
    },
  });

export default formOpts;
