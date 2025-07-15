import React from "react";
import AddCodeForm from "@/components/AddCodeForm";
import { getUser } from "@/lib/getUser";
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
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";

import LayoutAdmin from "@/components/LayoutAdmin";

export default async function SuperUser() {
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  if (
    !user ||
    (user.role !== "superuser" && user.role !== "admin")
  ) {
    redirect("/");
  }

  const forms = await db.query.forms.findMany({
    where: (form, { isNull }) => isNull(form.deletedAt),
  });

  const addedCodes = await db.query.codes.findMany({
    where: (codes, { eq }) =>
      eq(codes.createdById, user.id),
    with: {
      user: true,
    },
  });

  return (
    <LayoutAdmin headerTitle="Vragenlijsten klaarzetten">
      <div className="!max-w-3xl mx-auto">
        <AddCodeForm forms={forms} creatorId={user.id} />
      </div>
      {addedCodes.length > 0 && (
        <>
          <h2 className="text-2xl font-medium">
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
                    {forms.find((f) => f.id === code.formId)
                      ?.title ?? ""}
                  </TableCell>
                  <TableCell>{code.user?.email}</TableCell>
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
    </LayoutAdmin>
  );
}
