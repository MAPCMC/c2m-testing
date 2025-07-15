import React from "react";
import FormList from "@/components/FormList";
import PersonalFormList from "@/components/PersonalFormList";
import { Suspense } from "react";
import { getUser } from "@/lib/getUser";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import LayoutAdmin from "@/components/LayoutAdmin";

export default async function AdminHome() {
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
    <LayoutAdmin className="space-y-8 max-w-3xl mx-auto">
      <Suspense fallback={<p>Laden vragenlijsten...</p>}>
        <PersonalFormList />
        <FormList />
      </Suspense>
    </LayoutAdmin>
  );
}
