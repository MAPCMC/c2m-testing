import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = formOptions({
  defaultValues: {
    title: "",
    description: "",
    appId: "",
  },
});

export default formOpts;
