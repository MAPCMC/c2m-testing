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
      with: {
        questions: true,
      },
    }
  );

  if (!formChapter) {
    redirect("/admin/forms");
  }

  return (
    <LayoutAdmin
      headerTitle={`Hoofdstuk bewerken: ${formChapter.title}`}
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

      <h2 className="text-2xl font-bold text-center">
        Vragen
      </h2>
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
                        </Link>
                      </Button>
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
