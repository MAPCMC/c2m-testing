import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = formOptions({
  defaultValues: {
    email: "",
    formId: "",
    creatorId: "",
  },
});

export default formOpts;
