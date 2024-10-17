import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";

export const getFormUser = async (currentCode?: {
  userId: string | null;
  createdById: string | null;
  link: string;
}): Promise<
  | "none"
  | "self"
  | "invited"
  | "anonymous"
  | "superuser"
  | "blocked"
> => {
  const session = await getServerSession(authOptions);

  if (!currentCode) {
    return "none";
  }

  if (currentCode.userId) {
    if (!session?.user) {
      return "invited";
    }
    if (
      !!session?.user &&
      currentCode.userId === session?.user?.id
    ) {
      return "self";
    }
  }

  if (
    !!session?.user &&
    currentCode.createdById === session?.user?.id
  ) {
    return "superuser";
  }

  if (
    !currentCode.userId &&
    session?.user?.id === "anonymous" &&
    session?.user?.name === currentCode.link
  ) {
    return "anonymous";
  }

  return "blocked";
};
