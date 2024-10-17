import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = (code: string) =>
  formOptions({
    defaultValues: {
      email: "",
      code: code,
    },
  });

export default formOpts;
