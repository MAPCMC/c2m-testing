import React from "react";
import FormList from "@/components/FormList";
import PersonalForm from "@/components/PersonalForm/index";
import PersonalFormList from "@/components/PersonalFormList";
import { Suspense } from "react";
import { getUser } from "@/lib/getUser";
import NavBar from "@/components/NavBar/index";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import { PageMain } from "@/components/PageMain";
import { PageHeader } from "@/components/PageHeader";
import LayoutNormal from "@/components/LayoutNormal";

export default async function Home() {
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  const isAdmin =
    !!user &&
    (user.role === "superuser" || user.role === "admin");

  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <LayoutNormal>
      <NavBar />
      <PageHeader
        title="Connect2Music testportaal"
        className="space-y-3"
      />
      <PageMain className="space-y-8">
        <Suspense fallback={<p>Laden vragenlijsten...</p>}>
          {!user && <PersonalForm />}
          <PersonalFormList />
          <FormList />
        </Suspense>
      </PageMain>
    </LayoutNormal>
  );
}
