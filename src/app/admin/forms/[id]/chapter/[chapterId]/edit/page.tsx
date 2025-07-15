import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditFormChapterForm from "@/components/EditFormChapterForm";
import db from "@/db";
import { redirect } from "next/navigation";
import {
  Table,
  TableCell,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReOrder from "@/components/ReOrder";
import RemoveButton from "@/components/RemoveButton";

async function EditFormChapter({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  const formChapter = await db.query.formChapters.findFirst(
    {
      where: (formChapters, { eq, isNull, and }) =>
        and(
          eq(formChapters.id, Number(chapterId)),
          isNull(formChapters.deletedAt)
        ),
      with: {
        questions: {
          where: (questions, { isNull }) =>
            isNull(questions.deletedAt),
        },
      },
    }
  );

  if (!formChapter) {
    redirect("/admin/forms");
  }

  return (
    <LayoutAdmin
      headerTitle={`Bewerken: ${formChapter.title}`}
      breadcrumb={[
        {
          title: "Vragenlijst",
          href: `/admin/forms/${id}/edit`,
        },
        {
          title: "Hoofdstuk",
          href: `/admin/forms/${id}/chapter/${chapterId}/edit`,
        },
      ]}
    >
      <EditFormChapterForm
        formChapter={formChapter}
        backUri={`/admin/forms/${id}/edit`}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Vragen</h2>
        <Button asChild>
          <Link
            href={`/admin/forms/${id}/chapter/${chapterId}/question/new`}
          >
            Nieuw vraag
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>
          Een lijst van alle vragen in dit hoofdstuk
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">
              Vraag
            </TableHead>
            <TableHead className="font-bold">
              Type
            </TableHead>
            <TableHead className="font-bold">
              Volgorde
            </TableHead>
            <TableHead className="font-bold">
              Acties
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formChapter.questions
            .sort((a, b) => a.order - b.order)
            .map((question) => {
              return (
                <TableRow key={question.id}>
                  <TableCell>{question.label}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>
                    <ReOrder
                      order={question.order}
                      id={question.id}
                      schemaName="questions"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link
                          href={`/admin/forms/${id}/chapter/${chapterId}/question/${question.id}/edit`}
                        >
                          Bewerken
                          <span className="sr-only">
                            {question.label}
                          </span>
                        </Link>
                      </Button>
                      <RemoveButton
                        size="sm"
                        schemaName="questions"
                        id={question.id}
                        alertTitle="Vraag nu verwijderen"
                        alertDescription="Weet je zeker dat je deze vraag wilt verwijderen?"
                      >
                        Verwijderen
                        <span className="sr-only">
                          {question.label}
                        </span>
                      </RemoveButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditFormChapter,
  role: "admin",
});
