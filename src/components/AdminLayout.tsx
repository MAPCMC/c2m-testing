import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";

import { AppSidebar } from "@/components/AppSidebar";

async function AdminLayout({
  children,
  headerTitle,
}: Readonly<{
  children: React.ReactNode;
  headerTitle?: string;
}>) {
  return (
    <>
      <AppSidebar />
      <div className="w-full min-h-screen">
        <NavBar withSidebar />
        <PageHeader
          // className="border-b-2 max-w-none mx-0 text-center"
          title={headerTitle ?? "Admin"}
        />
        <PageMain>{children}</PageMain>
      </div>
    </>
  );
}

export default AdminLayout;
