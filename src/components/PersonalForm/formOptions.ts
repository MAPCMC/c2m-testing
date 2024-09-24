// Notice the import path is different from the client
import { formOptions } from "@tanstack/react-form/nextjs";

// You can pass other form options here, like `validatorAdapter`
const formOpts = formOptions({
  defaultValues: {
    link: "",
  },
});

export default formOpts;
