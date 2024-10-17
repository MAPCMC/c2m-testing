"use server";

import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";

export const navigateToSession = async (code: string) => {
  const session = await getServerSession(authOptions);
  // if user is "form user", redirect to current form
  if (
    session?.user &&
    session.user.id === "anonymous" &&
    session.user.name !== code
  ) {
    redirect(`/${session.user.name}`);
  } else {
    return;
  }
};
