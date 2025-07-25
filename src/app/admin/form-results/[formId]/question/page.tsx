import React from "react";
import db from "@/db";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Admin({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const form = await db.query.forms.findFirst({
    where: (form, { eq }) => eq(form.id, formId),
    with: {
      formChapters: {
        with: {
          questions: {
            where: (question, { isNull }) =>
              isNull(question.deletedAt),
            orderBy: (questions, { asc }) => [
              asc(questions.order),
            ],
          },
        },
        orderBy: (formChapters, { asc }) => [
          asc(formChapters.order),
        ],
      },
    },
  });

  if (
    form &&
    form.formChapters.length > 0 &&
    form.formChapters[0].questions.length > 0
  ) {
    redirect(
      `/admin/form-results/${form.id}/question/${form.formChapters[0].questions[0].id}`
    );
  }

  return (
    <LayoutAdmin headerTitle="Resultaten per ingevuld formulier">
      <>
        <p>
          Selecteer een ingevuld vraag om de resultaten te
          bekijken.
        </p>
        <ul className="space-y-2">
          {form?.formChapters.map((chapter) => (
            <li>
              <p>{chapter.title}</p>
              {chapter.questions.map((question) => (
                <li key={question.id}>
                  <Link
                    href={`/admin/form-results/${formId}/question/${question.id}`}
                  >
                    {question.label}
                  </Link>
                </li>
              ))}
            </li>
          ))}
        </ul>
      </>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: Admin,
  role: "admin",
});
