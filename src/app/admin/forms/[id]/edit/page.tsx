import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditFormForm from "@/components/EditFormForm";
import db from "@/db";
import { redirect } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPreviewText } from "@/lib/getPreviewText";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function EditForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await db.query.forms.findFirst({
    where: (forms, { eq }) => eq(forms.id, id),
    with: {
      formChapters: true,
    },
  });
  const apps = await db.query.apps.findMany();

  if (!form) {
    redirect("/admin/forms");
  }

  return (
    <LayoutAdmin
      headerTitle={`Vragenlijst bewerken: ${form.title}`}
    >
      <EditFormForm form={form} apps={apps} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">
          Hoofdstukken
        </h2>
        <Button asChild>
          <Link
            href={`/admin/forms/${form.id}/chapter/new`}
          >
            Nieuw hoofdstuk
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>
          Een lijst van alle hoofdstukken
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">
              Titel
            </TableHead>
            <TableHead className="font-bold">
              Beschrijving
            </TableHead>
            <TableHead className="font-bold">
              Acties
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {form.formChapters
            .sort((a, b) => a.order - b.order)
            .map((formChapter) => {
              return (
                <TableRow key={formChapter.id}>
                  <TableCell className="font-medium">
                    {formChapter.title}
                  </TableCell>
                  <TableCell>
                    {getPreviewText(
                      formChapter.description ?? ""
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link
                          href={`/admin/forms/${form.id}/chapter/${formChapter.id}/edit`}
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
  Component: EditForm,
  role: "admin",
});
