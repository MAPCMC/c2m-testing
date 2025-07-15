import React from "react";
import AddFormQuestionForm from "@/components/AddFormQuestionForm";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";

async function NewForm({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  return (
    <LayoutAdmin
      headerTitle="Nieuwe vraag"
      breadcrumb={[
        {
          title: "Vragenlijst",
          href: `/admin/forms/${id}/edit`,
        },
        {
          title: "Hoofdstuk",
          href: `/admin/forms/${id}/chapter/${chapterId}/edit`,
        },
        {
          title: "Nieuwe vraag",
          href: `/admin/forms/${id}/chapter/${chapterId}/question/new`,
        },
      ]}
    >
      <AddFormQuestionForm
        formId={id}
        chapterId={chapterId}
      />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: NewForm,
  role: "admin",
});
