import React from "react";
import AddCodeForm from "@/components/AddCodeForm";
import { getUser } from "@/lib/getUser";
import NavBar from "@/components/NavBar/index";
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
import CopyButton from "@/components/CopyButton";

export default async function SuperUser() {
  const user = await getUser();

  if (!user || user.role !== "superuser") {
    return <div>Geen toegang</div>;
  }

  const forms = await db.query.forms.findMany();

  const addedCodes = await db.query.codes.findMany({
    where: (codes, { eq }) =>
      eq(codes.createdById, user.id),
    with: {
      user: true,
    },
  });

  return (
    <>
      <NavBar />
      <header className="space-y-8 p-8 sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Connect2Music testportaal
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:px-20 pb-20 grow max-w-3xl">
        <AddCodeForm forms={forms} creatorId={user.id} />
        {addedCodes.length > 0 && (
          <>
            <h2 className="text-2xl">
              Klaargezette vragenlijsten
            </h2>
            <Table>
              <TableCaption>
                Een lijst van de vragenlijsten die je hebt
                klaargezet voor andere gebruikers.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Formulier</TableHead>
                  <TableHead>Gebruiker</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addedCodes.map((code) => (
                  <TableRow key={code.link}>
                    <TableCell className="font-medium">
                      {forms.find(
                        (f) => f.id === code.formId
                      )?.title ?? ""}
                    </TableCell>
                    <TableCell>
                      {code.user?.email}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button asChild>
                        <Link href={`/${code.link}`}>
                          Inzien
                        </Link>
                      </Button>
                      <CopyButton target={code.link}>
                        Kopieer {code.link}
                      </CopyButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </main>
    </>
  );
}
