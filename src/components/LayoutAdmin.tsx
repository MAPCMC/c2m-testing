import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

async function LayoutAdmin({
  children,
  headerTitle,
  breadcrumb,
  className,
}: Readonly<{
  children: React.ReactNode;
  headerTitle?: string;
  breadcrumb?: { title: string; href: string }[];
  className?: string;
}>) {
  return (
    <>
      <Button asChild>
        <a
          href="#main-content"
          className="fixed top-2 left-2 z-50 -translate-x-[calc(100%+2rem)] focus-visible:translate-x-0"
        >
          Naar paginainhoud
        </a>
      </Button>
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
        <PageMain
          id="main-content"
          admin
          className={className}
        >
          {children}
        </PageMain>
      </div>
    </>
  );
}

export default LayoutAdmin;
