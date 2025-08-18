import React from "react";
import db from "@/db";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Admin({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const codes = await db.query.codes.findMany({
    where: (code, { eq }) => eq(code.formId, formId),
  });

  if (codes.length > 0) {
    redirect(
      `/admin/form-results/${codes[0].formId}/result/${codes[0].link}`
    );
  }

  return (
    <LayoutAdmin headerTitle="Resultaten per ingevuld formulier">
      <>
        <p>
          Selecteer een ingevuld formulier om de resultaten
          te bekijken.
        </p>
        <ul className="space-y-2">
          {codes.map((code) => (
            <li key={code.link}>
              <Link
                href={`/admin/form-results/${formId}/result/${code.link}`}
              >
                {code.link}
              </Link>
            </li>
          ))}
        </ul>
      </>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: Admin,
  role: "admin",
});
