import { formOptions } from "@tanstack/react-form/nextjs";
import { users } from "@/db/schema";

const formOpts = (
  data?: Omit<
    typeof users.$inferSelect,
    "email" | "emailVerified"
  >
) =>
  formOptions({
    defaultValues: {
      id: data?.id ?? "",
      role: data?.role ?? "_none",
    },
  });

export default formOpts;
