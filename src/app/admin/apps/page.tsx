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
import Link from "next/link";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import RemoveButton from "@/components/RemoveButton";
import { removeApp } from "@/lib/removeApp";

async function Apps() {
  const apps = await db.query.apps.findMany();

  return (
    <LayoutAdmin headerTitle="Applicatiebeheer">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">
          Applicaties
        </h2>
        <Button asChild>
          <Link href="/admin/apps/new">
            Nieuwe applicatie
          </Link>
        </Button>
      </div>

      <Table className="w-full">
        <TableCaption>
          Een lijst van alle applicaties van C2M
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
              Link
            </TableHead>
            <TableHead className="font-bold">
              Acties
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                {app.name}
              </TableCell>
              <TableCell>{app.description}</TableCell>
              <TableCell>{app.link}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link
                      href={`/admin/apps/${app.id}/edit`}
                    >
                      Bewerken
                      <span className="sr-only">
                        {app.name}
                      </span>
                    </Link>
                  </Button>
                  <RemoveButton
                    schemaName="apps"
                    size="sm"
                    id={app.id}
                    customRemove={removeApp}
                    alertTitle="App nu verwijderen"
                    alertDescription="Weet je zeker dat je deze app wilt verwijderen? Let op: deze actie is alleen mogelijk wanneer er geen vragenlijsten zijn gekoppeld."
                  >
                    Verwijderen
                    <span className="sr-only">
                      {app.name}
                    </span>
                  </RemoveButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: Apps,
  role: "admin",
});
