import React from "react";
import AddAppForm from "@/components/AddAppForm";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";

async function NewApp() {
  return (
    <LayoutAdmin headerTitle="Nieuwe applicatie toevoegen">
      <AddAppForm />
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: NewApp,
  role: "admin",
});
