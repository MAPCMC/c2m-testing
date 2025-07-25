import React from "react";
import { notFound } from "next/navigation";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import { ExportButton } from "@/components/ExportButton";
import QuestionAnalysis from "@/components/QuestionAnalysis";
import db from "@/db";

async function FormResultsAnalysis({
  params,
}: {
  params: Promise<{
    formId: string;
  }>;
}) {
  const { formId } = await params;

  // Get all forms with their questions and chapters
  const form = await db.query.forms.findFirst({
    where: (form, { isNull, eq, and }) =>
      and(isNull(form.deletedAt), eq(form.id, formId)),
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

  if (!form) {
    return notFound();
  }

  // Get all answers with their related data
  const answers = await db.query.answers.findMany({
    with: {
      question: true,
      answersToOptions: {
        with: {
          option: true,
        },
      },
    },
  });

  // Group answers by question key
  const answersByQuestion = answers.reduce(
    (acc, answer) => {
      if (!answer.questionKey) return acc;

      if (!acc[answer.questionKey]) {
        acc[answer.questionKey] = [];
      }
      acc[answer.questionKey].push(answer);
      return acc;
    },
    {} as Record<string, typeof answers>
  );

  // Get all options for answer processing
  const options = await db.query.options.findMany();

  // Prepare data for export
  const prepareExportData = () => {
    const exportData: any[] = [];

    form.formChapters.forEach((chapter) => {
      chapter.questions.forEach((question) => {
        const questionAnswers =
          answersByQuestion[question.key] || [];

        questionAnswers.forEach((answer) => {
          let answerText = answer.text || "";

          // Process options if available
          if (answer.answersToOptions?.length > 0) {
            answerText = answer.answersToOptions
              .map((ao) => ao.option?.text)
              .filter(Boolean)
              .join("; ");
          }

          exportData.push({
            Formulier: form.title,
            Hoofdstuk: chapter.title,
            Vraag: question.label,
            Vraagtype: question.type,
            Antwoord: answerText,
            //   Datum: answer.createdAt
            //     ? new Date(answer.createdAt).toISOString()
            //     : "",
          });
        });
      });
    });

    return exportData;
  };

  return (
    <LayoutAdmin
      headerTitle="Resultatenanalyse"
      formId={formId}
      tabs={[
        {
          title: "Overzicht",
          href: `/admin/form-results/${formId}/summary`,
          active: true,
        },
        {
          title: "Per vraag",
          href: `/admin/form-results/${formId}/question`,
        },
        {
          title: "Per ingevuld formulier",
          href: `/admin/form-results/${formId}/result`,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <p className="text-muted-foreground">
            Analyseer en verken de verzamelde antwoorden
          </p>
          <ExportButton
            data={prepareExportData()}
            filename={`form-answers-${
              new Date().toISOString().split("T")[0]
            }`}
            label="Exporteer alle antwoorden (CSV)"
          />
        </div>

        {form.formChapters.map((chapter) => (
          <div key={chapter.id} className="space-y-4">
            <h2 className="text-xl font-semibold">
              {chapter.title}
            </h2>
            <div className="space-y-8">
              {chapter.questions.map((question) => {
                const questionAnswers =
                  answersByQuestion[question.key] || [];
                return (
                  <QuestionAnalysis
                    key={question.id}
                    question={question}
                    answers={questionAnswers}
                    allOptions={options}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: FormResultsAnalysis,
  role: "admin",
});
