import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";
import { BackButton } from "@/components/BackButton";
import AddFormForm from "@/components/AddFormForm";
import db from "@/db";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";

async function NewForm() {
  const apps = await db.query.apps.findMany();

  return (
    <>
      <NavBar noLogout>
        <BackButton href="/forms" />
      </NavBar>
      <PageHeader title="Nieuw formulier" />
      <PageMain className="max-w-2xl mx-auto">
        <AddFormForm apps={apps} />
      </PageMain>
    </>
  );
}

export default AuthenticatedPage({
  Component: NewForm,
  role: "admin",
});
