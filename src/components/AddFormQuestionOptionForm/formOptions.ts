import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = formOptions({
  defaultValues: {
    text: "",
    value: "",
  },
});

export default formOpts;
