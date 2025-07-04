import React from "react";
import AddChapterForm from "@/components/AddChapterForm";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";

async function NewForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <LayoutAdmin
      headerTitle="Nieuw hoofdstuk"
      breadcrumb={[
        {
          title: "Vragenlijst",
          href: `/admin/forms/${id}/edit`,
        },
        {
          title: "Nieuw hoofdstuk",
          href: `/admin/forms/${id}/chapter/new`,
        },
      ]}
    >
      <AddChapterForm formId={id} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: NewForm,
  role: "admin",
});
