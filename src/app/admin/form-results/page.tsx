import React from "react";
import db from "@/db";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Admin() {
  const forms = await db.query.forms.findMany({
    where: (form, { isNull }) => isNull(form.deletedAt),
  });

  if (forms.length > 0) {
    redirect(`/admin/form-results/${forms[0].id}/summary`);
  }

  return (
    <LayoutAdmin headerTitle="Resultaten">
      <>
        <h2 className="text-2xl font-medium">
          Resultaten inzien
        </h2>
        <p>
          Selecteer een formulier om de resultaten te
          bekijken.
        </p>
        <ul className="space-y-2">
          {forms.map((form) => (
            <li key={form.id}>
              <Link
                href={`/admin/form-results/${form.id}/summary`}
              >
                {form.title}
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
