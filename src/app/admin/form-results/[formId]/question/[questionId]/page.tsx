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

    if (!question) {
      return exportData;
    }

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
        Vraag: question.label,
        Vraagtype: question.type,
        Antwoord: answerText,
        //   Datum: answer.createdAt
        //     ? new Date(answer.createdAt).toISOString()
        //     : "",
      });
    });

    return exportData;
  };

  return (
    <LayoutAdmin
      headerTitle="Antwoorden per vraag"
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
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground">
            {question?.label}
          </p>

          <ExportButton
            data={prepareExportData()}
            filename={`form-answers-${
              new Date().toISOString().split("T")[0]
            }`}
            label="Exporteer alle antwoorden (CSV)"
          />
        </div>
      </div>

      <Table>
        <TableCaption>
          Een lijst van alle antwoorden voor deze vraag.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">
              Tekst
            </TableHead>
            <TableHead className="font-bold">
              Opties
            </TableHead>
            <TableHead className="font-bold">
              Score
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {answers.map((answer) => {
            return (
              <TableRow key={answer.id}>
                <TableCell>{answer?.text}</TableCell>
                <TableCell>
                  {!!answer?.answersToOptions?.length &&
                    answer?.answersToOptions?.length >
                      0 && (
                      <ul>
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
                </TableCell>
                <TableCell>{answer.score}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-between gap-2">
        <Button
          asChild
          variant="outline"
          disabled={!prevQuestion}
        >
          {prevQuestion ? (
            <Link
              href={`/admin/form-results/${form.id}/question/${prevQuestion.id}`}
            >
              Terug
            </Link>
          ) : (
            "Terug"
          )}
        </Button>
        <Button
          asChild
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
