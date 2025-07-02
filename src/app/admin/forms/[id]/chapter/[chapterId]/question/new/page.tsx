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
    <LayoutAdmin headerTitle="Nieuwe vraag">
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
