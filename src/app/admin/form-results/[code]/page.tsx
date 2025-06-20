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

export default async function AdminCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

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
    where: (a, { eq }) => eq(a.code, code),
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
    <LayoutAdmin headerTitle="Vragenlijst inzien">
      <h2 className="text-2xl font-medium">
        Vragenlijst: {form.title}
      </h2>
      <BackButton />
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
                        <li>
                          {answer?.answersToOptions.map(
                            (a) => (
                              <li key={a.option.id}>
                                {a.option.text}
                                {a.explanation ? ": " : ""}
                                {a.explanation}
                              </li>
                            )
                          )}
                        </li>
                      )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </LayoutAdmin>
  );
}
