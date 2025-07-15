import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditAppForm from "@/components/EditAppForm";
import db from "@/db";

async function EditApp({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await db.query.apps.findFirst({
    where: (apps, { eq, isNull, and }) =>
      and(eq(apps.id, id), isNull(apps.deletedAt)),
  });

  return (
    <LayoutAdmin
      headerTitle="Applicatie bewerken"
      breadcrumb={[
        {
          title: "Applicaties",
          href: "/admin/apps",
        },
        {
          title: "Applicatie bewerken",
          href: `/admin/apps/${app?.id}/edit`,
        },
      ]}
    >
      <EditAppForm app={app} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditApp,
  role: "admin",
});
