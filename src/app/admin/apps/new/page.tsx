import React from "react";
import AddAppForm from "@/components/AddAppForm";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";

async function NewApp() {
  return (
    <LayoutAdmin
      headerTitle="Nieuwe applicatie toevoegen"
      breadcrumb={[
        {
          title: "Applicaties",
          href: "/admin/apps",
        },
        {
          title: "Nieuwe applicatie",
          href: "/admin/apps/new",
        },
      ]}
    >
      <AddAppForm />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: NewApp,
  role: "admin",
});
