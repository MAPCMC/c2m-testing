import { formOptions } from "@tanstack/react-form/nextjs";
import { options } from "@/db/schema";

const formOpts = (option: typeof options.$inferSelect) => {
  return formOptions({
    defaultValues: {
      id: option.id,
      text: option.text ?? "",
      value: option.value ?? "",
    },
  });
};

export default formOpts;
