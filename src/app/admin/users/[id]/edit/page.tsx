import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditUserForm from "@/components/EditUserForm";
import db from "@/db";

async function EditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });

  return (
    <LayoutAdmin headerTitle="Gebruiker bewerken">
      <EditUserForm user={user} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditUser,
  role: "admin",
});
