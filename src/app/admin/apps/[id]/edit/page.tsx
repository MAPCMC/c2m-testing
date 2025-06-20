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
    where: (apps, { eq }) => eq(apps.id, id),
  });

  return (
    <LayoutAdmin headerTitle="Applicatie bewerken">
      <EditAppForm app={app} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditApp,
  role: "admin",
});
