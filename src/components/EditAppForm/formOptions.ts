import { formOptions } from "@tanstack/react-form/nextjs";
import { apps } from "@/db/schema";

const formOpts = (data?: typeof apps.$inferSelect) =>
  formOptions({
    defaultValues: {
      id: data?.id ?? "",
      link: data?.link ?? "",
      description: data?.description ?? "",
      name: data?.name ?? "",
    },
  });

export default formOpts;
