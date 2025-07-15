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

async function Admin() {
  const forms = await db.query.forms.findMany({
    where: (form, { isNull }) => isNull(form.deletedAt),
  });
  const codes = await db.query.codes.findMany({
    with: {
      user: true,
    },
  });

  const findUserInfo = async (
    code: string,
    email?: string
  ) => {
    if (email) {
      return email;
    }

    const nameAnswer = await db.query.answers.findFirst({
      where: (a, { eq, and }) =>
        and(
          eq(a.code, code),
          eq(a.questionKey, "profile_name")
        ),
    });
    if (nameAnswer) {
      return nameAnswer.text;
    }

    return "anoniem";
  };

  return (
    <LayoutAdmin headerTitle="Resultaten">
      {codes.length > 0 && (
        <>
          <h2 className="text-2xl font-medium">
            Vragenlijsten inzien
          </h2>
          <Table>
            <TableCaption>
              Een lijst van de vragenlijsten die zijn
              klaargezet en/of ingevuld.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">
                  Formulier
                </TableHead>
                <TableHead className="font-bold">
                  Gebruiker
                </TableHead>
                <TableHead className="font-bold">
                  Acties
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.link}>
                  <TableCell className="font-medium">
                    {forms.find((f) => f.id === code.formId)
                      ?.title ?? ""}
                  </TableCell>
                  <TableCell>
                    {findUserInfo(
                      code.link,
                      code?.user?.email
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button asChild>
                      <Link
                        href={`/admin/form-results/${code.link}`}
                      >
                        Antwoorden inzien
                      </Link>
                    </Button>
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

export default AuthenticatedPage({
  Component: Admin,
  role: "admin",
});
