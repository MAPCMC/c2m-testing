import React from "react";
import { getUser } from "@/lib/getUser";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";
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

  console.log(codes, currentIndex, prevCode, nextCode);

  if (!currentCode) {
    return (
      <LayoutAdmin>
        <NavBar />
        <PageHeader title="Admin" />
        <PageMain>
          Controleer de code.
          <BackButton />
        </PageMain>
      </LayoutAdmin>
    );
  }

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

  if (!form) {
    return (
      <LayoutAdmin>
        <NavBar />
        <PageHeader title="Admin" />
        <PageMain>
          Formulier niet gevonden.
          <BackButton />
        </PageMain>
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
    >
      <Table>
        <TableCaption>
          Een lijst van vragen en antwoorden voor deze
          vragenlijst.
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
                  <TableCell className="font-medium max-w-40">
                    {question.label}
                  </TableCell>
                  <TableCell>{answer?.score}</TableCell>
                  <TableCell>
                    {answer?.text}

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
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between gap-2">
        <Button
          asChild
          variant="outline"
          disabled={!prevCode}
        >
          {prevCode ? (
            <Link
              href={`/admin/form-results/${form.id}/result/${prevCode}`}
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
