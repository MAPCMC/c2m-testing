import React from "react";
import { getUser } from "@/lib/getUser";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
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

export default async function Admin() {
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const forms = await db.query.forms.findMany();
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
    <>
      <NavBar />
      <PageHeader title="Admin" />
      <PageMain className="*:max-w-full">
        {codes.length > 0 && (
          <>
            <h2 className="text-2xl font-medium">
              Vragenlijsten
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
                      {forms.find(
                        (f) => f.id === code.formId
                      )?.title ?? ""}
                    </TableCell>
                    <TableCell>
                      {findUserInfo(
                        code.link,
                        code?.user?.email
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button asChild>
                        <Link href={`/admin/${code.link}`}>
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
      </PageMain>
    </>
  );
}
