import { formOptions } from "@tanstack/react-form/nextjs";

const formOpts = formOptions({
  defaultValues: {
    link: "",
    description: "",
    name: "",
    id: "",
  },
});

export default formOpts;
