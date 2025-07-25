"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  forms as formsType,
  codes as codesType,
  users as usersType,
} from "@/db/schema";
import { findUserInfo } from "./findUserInfo";

interface UserInfo {
  [key: string]: string;
}

function FormResults({
  forms,
  codes,
  formId,
}: {
  forms: (typeof formsType.$inferSelect)[];
  codes: (typeof codesType.$inferSelect & {
    user: typeof usersType.$inferSelect | null;
  })[];
  formId: string;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [loading, setLoading] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch user info for a specific code
  const fetchUserInfo = async (
    code: string,
    email?: string
  ) => {
    if (userInfo[code] || loading[code]) return;

    setLoading((prev) => ({ ...prev, [code]: true }));
    try {
      const name = await findUserInfo(code, email);
      setUserInfo((prev) => ({ ...prev, [code]: name }));
    } catch (error) {
      console.error(
        `Failed to fetch user info for code ${code}:`,
        error
      );
      setUserInfo((prev) => ({
        ...prev,
        [code]: "anoniem",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [code]: false }));
    }
  };

  // When formId changes, fetch user info for all visible codes
  useEffect(() => {
    if (!formId) return;

    const codesToFetch = codes
      .filter((code) => code.formId === formId)
      .map((code) => code.link);

    codesToFetch.forEach((code) => {
      const codeData = codes.find((c) => c.link === code);
      fetchUserInfo(code, codeData?.user?.email);
    });
  }, [formId, codes]);

  return (
    <div>
      {!!formId && (
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
            {codes
              .filter((code) => code.formId === formId)
              .map((code) => (
                <TableRow key={code.link}>
                  <TableCell className="font-medium">
                    {forms.find((f) => f.id === code.formId)
                      ?.title ?? ""}
                  </TableCell>
                  <TableCell>
                    {loading[code.link]
                      ? "Laden..."
                      : userInfo[code.link] || "anoniem"}
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
      )}
    </div>
  );
}

export default FormResults;
