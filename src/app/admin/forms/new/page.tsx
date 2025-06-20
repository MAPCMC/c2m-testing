import React from "react";
import AddFormForm from "@/components/AddFormForm";
import db from "@/db";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";

async function NewForm() {
  const apps = await db.query.apps.findMany();

  return (
    <LayoutAdmin headerTitle="Nieuwe vragenlijst">
      <AddFormForm apps={apps} />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: NewForm,
  role: "admin",
});
