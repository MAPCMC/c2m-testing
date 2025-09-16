import React from "react";
import { getUser } from "@/lib/getUser";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import db from "@/db";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFullForm } from "@/lib/getFullForm";
import BackButton from "@/components/BackButton";
import LayoutAdmin from "@/components/LayoutAdmin";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChooseCodeMenu from "@/components/ChooseCodeMenu";
import { ExportButton } from "@/components/ExportButton";
import prepareExportData from "./prepareExportData";

export default async function AdminCodePage({
  params,
}: {
  params: Promise<{ code: string; formId: string }>;
}) {
  const { code, formId } = await params;
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const codes = await db.query.codes.findMany({
    where: (c, { eq }) => eq(c.formId, formId),
  });

  const currentCode = codes.find((c) => c.link === code);
  const currentIndex = codes.findIndex(
    (c) => c.link === code
  );
  const prevCode = codes[currentIndex - 1]?.link;
  const nextCode = codes[currentIndex + 1]?.link;

  if (!currentCode) {
    return (
      <LayoutAdmin headerTitle={`Niet gevonden: ${code}`}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Controleer de code.
          </p>
          <BackButton />
        </div>
      </LayoutAdmin>
    );
  }

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

  if (!form) {
    return (
      <LayoutAdmin headerTitle="Formulier niet gevonden">
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Controleer de code.
          </p>
          <BackButton />
        </div>
      </LayoutAdmin>
    );
  }

  const answers = await db.query.answers.findMany({
    where: (a, { eq }) => eq(a.code, currentCode.link),
    with: {
      answersToOptions: {
        with: {
          option: true,
        },
      },
    },
  });

  const currentFormCodes = codes.filter(
    (c) => c.formId === formId
  );

  const exportData = prepareExportData(form, answers);

  const findQuestionAnswer = (key: string) =>
    answers.find((a) => a.questionKey === key);
  return (
    <LayoutAdmin
      headerTitle={`${form.title} inzien: ${code}`}
      formId={form.id}
      tabs={[
        {
          title: "Overzicht",
          href: `/admin/form-results/${form.id}/summary`,
        },
        {
          title: "Per vraag",
          href: `/admin/form-results/${form.id}/question`,
        },
        {
          title: "Per ingevuld formulier",
          href: `/admin/form-results/${form.id}/result`,
          active: true,
        },
      ]}
      className="space-y-2"
    >
      <div className="flex justify-between flex-wrap gap-2">
        <ChooseCodeMenu
          code={code}
          codes={currentFormCodes.map((c) => c.link)}
          formId={form.id}
          className="grow"
        />
        <ExportButton
          data={exportData}
          filename={`${form.title}-${code}-antwoorden-${
            new Date().toISOString().split("T")[0]
          }`}
          label="Exporteer antwoorden voor deze code (CSV)"
        />
      </div>
      <div className="bg-card border rounded-md p-4">
        <Table>
          <TableCaption>
            Alle vragen en antwoorden met code {code}.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">
                Vraag
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
            {form.formChapters.map((chapter) =>
              chapter.questions.map((question) => {
                const answer = findQuestionAnswer(
                  question.key
                );
                return (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium w-1/3 whitespace-normal">
                      {question.label}
                    </TableCell>
                    <TableCell>{answer?.score}</TableCell>
                    <TableCell className="whitespace-normal w-full space-y-2">
                      {!!answer?.answersToOptions?.length &&
                        answer?.answersToOptions?.length >
                          0 && (
                          <ul className="list-disc list-inside">
                            {answer?.answersToOptions.map(
                              (a) => (
                                <li key={a.option.id}>
                                  {a.option.text}
                                  {a.explanation
                                    ? ": "
                                    : ""}
                                  {a.explanation}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      {answer?.text && (
                        <p>{answer?.text}</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between gap-2">
        <Button
          asChild={!!prevCode}
          variant="outline"
          disabled={!prevCode}
        >
          {prevCode ? (
            <Link
              href={`/admin/form-results/${form.id}/result/${prevCode}`}
            >
              Vorige
            </Link>
          ) : (
            "Vorige"
          )}
        </Button>
        <Button
          asChild={!!nextCode}
          variant="outline"
          disabled={!nextCode}
        >
          {nextCode ? (
            <Link
              href={`/admin/form-results/${form.id}/result/${nextCode}`}
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
