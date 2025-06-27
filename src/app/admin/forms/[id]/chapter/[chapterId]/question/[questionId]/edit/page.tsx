import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditFormQuestionForm from "@/components/EditFormQuestionForm";
import db from "@/db";
import { redirect } from "next/navigation";

async function EditFormQuestion({
  params,
}: {
  params: Promise<{
    id: string;
    chapterId: string;
    questionId: string;
  }>;
}) {
  const { id, chapterId, questionId } = await params;
  const question = await db.query.questions.findFirst({
    where: (questions, { eq }) =>
      eq(questions.id, Number(questionId)),
    with: {
      formChapter: true,
    },
  });

  if (!question) {
    redirect(
      `/admin/forms/${id}/chapter/${chapterId}/edit`
    );
  }

  return (
    <LayoutAdmin
      headerTitle={`Vraag bewerken: ${question.label}`}
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
          title: "Vraag",
          href: `/admin/forms/${id}/chapter/${chapterId}/question/${questionId}/edit`,
        },
      ]}
    >
      <EditFormQuestionForm
        question={question}
        backUri={`/admin/forms/${id}/chapter/${chapterId}/edit`}
      />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditFormQuestion,
  role: "admin",
});
