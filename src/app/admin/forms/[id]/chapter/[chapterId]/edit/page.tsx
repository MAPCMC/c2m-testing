import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditFormChapterForm from "@/components/EditFormChapterForm";
import db from "@/db";
import { redirect } from "next/navigation";

async function EditFormChapter({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  const formChapter = await db.query.formChapters.findFirst(
    {
      where: (formChapters, { eq }) =>
        eq(formChapters.id, Number(chapterId)),
    }
  );

  if (!formChapter) {
    redirect("/admin/forms");
  }

  return (
    <LayoutAdmin
      headerTitle="Hoofdstuk bewerken"
      breadcrumb={[
        {
          title: "Vragenlijst bewerken",
          href: `/admin/forms/${id}/edit`,
        },
        {
          title: "Hoofdstuk bewerken",
          href: `/admin/forms/${id}/chapter/${chapterId}/edit`,
        },
      ]}
    >
      <EditFormChapterForm formChapter={formChapter} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditFormChapter,
  role: "admin",
});
