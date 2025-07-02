import React from "react";
import AddChapterForm from "@/components/AddChapterForm";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";

async function NewForm({
  params,
}: {
  params: { id: string };
}) {
  return (
    <LayoutAdmin headerTitle="Nieuw hoofdstuk">
      <AddChapterForm formId={params.id} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: NewForm,
  role: "admin",
});
