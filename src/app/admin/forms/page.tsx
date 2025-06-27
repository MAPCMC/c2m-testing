import React from "react";
import db from "@/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getPreviewText } from "@/lib/getPreviewText";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
// import { eq } from "drizzle-orm";
// import { forms as formsSchema } from "@/db/schema";
// import { RemoveButton } from "@/components/RemoveButton";

async function Forms() {
  const forms = await db.query.forms.findMany({
    with: {
      app: true,
    },
  });

  return (
    <LayoutAdmin headerTitle="Vragenlijstbeheer">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">
          Vragenlijsten
        </h2>
        <Button asChild>
          <Link href="/admin/forms/new">
            Nieuwe vragenlijst
          </Link>
        </Button>
      </div>

      <Table>
        <TableCaption>
          Een lijst van alle vragenlijsten
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">
              Titel
            </TableHead>
            <TableHead className="font-bold">
              Beschrijving
            </TableHead>
            <TableHead className="font-bold">App</TableHead>
            <TableHead className="font-bold">
              Acties
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => {
            return (
              <TableRow key={form.id}>
                <TableCell className="font-medium">
                  {form.title}
                </TableCell>
                <TableCell>
                  {getPreviewText(form.description ?? "")}
                </TableCell>
                <TableCell>
                  {form.app ? (
                    <Badge
                      variant="outline"
                      className="capitalize"
                    >
                      {form.app.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      Geen applicatie
                    </span>
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
                        href={`/admin/forms/${form.id}/edit`}
                      >
                        Bewerken
                      </Link>
                    </Button>
                    {/* <RemoveButton
                      variant="destructive"
                      size="sm"
                      handleClick={async () => {
                        "use server";
                        if (
                          confirm(
                            "Weet je zeker dat je dit formulier wilt verwijderen?"
                          )
                        ) {
                          await db
                            .delete(formsSchema)
                            .where(
                              eq(formsSchema.id, form.id)
                            );
                        }
                      }}
                    >
                      Verwijderen
                    </RemoveButton> */}
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
  Component: Forms,
  role: "admin",
});
