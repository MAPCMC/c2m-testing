import React from "react";
import { getUser } from "@/lib/getUser";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";

export default async function Admin() {
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  if (
    !user ||
    (user.role !== "superuser" && user.role !== "admin")
  ) {
    redirect("/");
  }
  return (
    <>
      <NavBar />
      <PageHeader title="Admin" />
      <PageMain>
        <p>hello</p>
      </PageMain>
    </>
  );
}
