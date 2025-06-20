import { formOptions } from "@tanstack/react-form/nextjs";
import { forms } from "@/db/schema";

const formOpts = (form: typeof forms.$inferSelect) =>
  formOptions({
    defaultValues: {
      title: form.title ?? "",
      description: form.description ?? "",
      appId: form.appId ?? "",
      id: form.id,
    },
  });

export default formOpts;
