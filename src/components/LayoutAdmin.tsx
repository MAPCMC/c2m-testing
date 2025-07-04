import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AppSidebar } from "@/components/AppSidebar";

async function LayoutAdmin({
  children,
  headerTitle,
  breadcrumb,
}: Readonly<{
  children: React.ReactNode;
  headerTitle?: string;
  breadcrumb?: { title: string; href: string }[];
}>) {
  return (
    <>
      <AppSidebar />
      <div className="w-full min-h-svh">
        <NavBar withSidebar className="*:max-w-none mx-0" />
        {breadcrumb?.length && (
          <Breadcrumb items={breadcrumb} />
        )}
        <PageHeader
          className="text-center *:mx-auto"
          title={headerTitle ?? "Admin dashboard"}
        />
        <PageMain className="max-w-none *:max-w-none">
          {children}
        </PageMain>
      </div>
    </>
  );
}

export default LayoutAdmin;
