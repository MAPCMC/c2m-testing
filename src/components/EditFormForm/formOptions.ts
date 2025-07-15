import { formOptions } from "@tanstack/react-form/nextjs";
import { forms } from "@/db/schema";

const formOpts = (
  form: Omit<typeof forms.$inferSelect, "deletedAt">
) =>
  formOptions({
    defaultValues: {
      title: form.title ?? "",
      description: form.description ?? "",
      appId: form.appId ?? "",
      id: form.id,
    },
  });

export default formOpts;
