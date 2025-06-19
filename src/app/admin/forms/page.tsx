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
import { RemoveButton } from "@/components/RemoveButton";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import AdminLayout from "@/components/AdminLayout";

async function Forms() {
  const forms = await db.query.forms.findMany({
    with: {
      app: true,
    },
  });

  return (
    <AdminLayout headerTitle="Vragenlijstbeheer">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">
          Vragenlijsten
        </h2>
        <Link href="/forms/new">
          <Button>New Form</Button>
        </Link>
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
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">
                {form.title}
              </TableCell>
              <TableCell>{form.description}</TableCell>
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
                    Geen app
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/forms/${form.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Bewerken
                    </Button>
                  </Link>
                  <RemoveButton
                    variant="destructive"
                    size="sm"
                    handleClick={async () => {
                      "use server";
                      if (
                        confirm(
                          "Weet je zeker dat je dit formulier wilt verwijderen?"
                        )
                      ) {
                        await db.delete(forms, {
                          where: (f, { eq }) =>
                            eq(f.id, form.id),
                        });
                      }
                    }}
                  >
                    Verwijderen
                  </RemoveButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
}

export default AuthenticatedPage({
  Component: Forms,
  role: "admin",
});
