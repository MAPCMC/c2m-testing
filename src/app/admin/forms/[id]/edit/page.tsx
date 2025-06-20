import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditFormForm from "@/components/EditFormForm";
import db from "@/db";
import { redirect } from "next/navigation";

async function EditForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await db.query.forms.findFirst({
    where: (forms, { eq }) => eq(forms.id, id),
  });
  const apps = await db.query.apps.findMany();

  if (!form) {
    redirect("/admin/forms");
  }

  return (
    <LayoutAdmin headerTitle="Vragenlijst bewerken">
      <EditFormForm form={form} apps={apps} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditForm,
  role: "admin",
});
