import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";

import { AppSidebar } from "@/components/AppSidebar";

async function LayoutAdmin({
  children,
  headerTitle,
}: Readonly<{
  children: React.ReactNode;
  headerTitle?: string;
}>) {
  return (
    <>
      <AppSidebar />
      <div className="w-full min-h-svh">
        <NavBar withSidebar className="*:max-w-none mx-0" />
        <PageHeader
          className="text-center *:mx-auto"
          title={headerTitle ?? "Admin dashboard"}
        />
        <PageMain className="*:mx-auto">
          {children}
        </PageMain>
      </div>
    </>
  );
}

export default LayoutAdmin;
