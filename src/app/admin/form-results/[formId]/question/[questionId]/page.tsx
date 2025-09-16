import React from "react";
import { notFound } from "next/navigation";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import db from "@/db";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import ChooseQuestionForm from "@/components/ChooseQuestionForm";
import prepareExportData from "./prepareExportData";

async function FormResultsQuestion({
  params,
}: {
  params: Promise<{ formId: string; questionId: string }>;
}) {
  const { formId, questionId } = await params;
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

  const questions = form.formChapters.flatMap(
    (chapter) => chapter.questions
  );
  const question = questions.find(
    (question) => question.id.toString() === questionId
  );

  const questionIndex = questions.findIndex(
    (question) => question.id.toString() === questionId
  );

  const prevQuestion = questions[questionIndex - 1];
  const nextQuestion = questions[questionIndex + 1];

  if (!question) {
    return notFound();
  }

  // Get all answers with their related data
  const answers = await db.query.answers.findMany({
    where: (answer, { eq }) =>
      eq(answer.questionKey, question.key),
    with: {
      answersToOptions: {
        with: {
          option: true,
        },
      },
    },
  });

  const exportData = prepareExportData(answers);

  return (
    <LayoutAdmin
      headerTitle={`Antwoorden op vraag: ${question.label}`}
      formId={formId}
      tabs={[
        {
          title: "Overzicht",
          href: `/admin/form-results/${form.id}/summary`,
        },
        {
          title: "Per vraag",
          href: `/admin/form-results/${form.id}/question`,
          active: true,
        },
        {
          title: "Per ingevuld formulier",
          href: `/admin/form-results/${form.id}/result`,
        },
      ]}
      className="space-y-2"
    >
      <div className="flex justify-between flex-wrap gap-2">
        <ChooseQuestionForm
          questions={questions.map((q) => ({
            id: q.id.toString(),
            label: q.label,
          }))}
          questionId={questionId}
          formId={formId}
          className="grow"
        />
        <ExportButton
          data={exportData}
          filename={`${form.title}-${
            question.key
          }-antwoorden-${
            new Date().toISOString().split("T")[0]
          }`}
          label="Exporteer antwoorden voor deze vraag (CSV)"
        />
      </div>
      <div className="bg-card border rounded-md p-4">
        <Table className="max-w-full">
          <TableCaption>
            Een lijst van alle antwoorden voor deze vraag.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">
                Formulier
              </TableHead>
              <TableHead className="font-bold">
                Score
              </TableHead>
              <TableHead className="font-bold">
                Antwoord
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers.map((answer) => {
              return (
                <TableRow key={answer.id}>
                  <TableCell>
                    <Link
                      href={`/admin/form-results/${form.id}/result/${answer.code}`}
                    >
                      {answer?.code}
                    </Link>
                  </TableCell>
                  <TableCell>{answer.score}</TableCell>
                  <TableCell className="whitespace-normal w-full space-y-2">
                    {!!answer?.answersToOptions?.length &&
                      answer?.answersToOptions?.length >
                        0 && (
                        <ul className="list-disc list-inside">
                          {answer?.answersToOptions.map(
                            (a) => (
                              <li key={a.option.id}>
                                {a.option.text}
                                {a.explanation ? ": " : ""}
                                {a.explanation}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    {answer.text && <p>{answer?.text}</p>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between gap-2">
        <Button
          asChild={prevQuestion ? true : false}
          variant="outline"
          disabled={!prevQuestion}
        >
          {prevQuestion ? (
            <Link
              href={`/admin/form-results/${form.id}/question/${prevQuestion.id}`}
            >
              Vorige
            </Link>
          ) : (
            "Vorige"
          )}
        </Button>
        <Button
          asChild={nextQuestion ? true : false}
          variant="outline"
          disabled={!nextQuestion}
        >
          {nextQuestion ? (
            <Link
              href={`/admin/form-results/${form.id}/question/${nextQuestion.id}`}
            >
              Volgende
            </Link>
          ) : (
            "Volgende"
          )}
        </Button>
      </div>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: FormResultsQuestion,
  role: "admin",
});
