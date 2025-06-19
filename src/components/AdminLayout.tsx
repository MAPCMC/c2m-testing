import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import NavBar from "@/components/NavBar/index";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function AdminLayout({
  children,
  headerTitle,
}: Readonly<{
  children: React.ReactNode;
  headerTitle?: string;
}>) {
  return (
    <>
      <div className="w-full min-h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr]">
        <NavBar className="col-span-2" />
        <PageHeader
          className="border-b-2 max-w-none mx-0 text-center col-start-2"
          title={headerTitle ?? "Admin"}
        />
        <aside className="border-r-2 p-4 row-span-2 row-start-2">
          <nav>
            <ul className="flex flex-col gap-2">
              <li>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Dashboard</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/form-results">
                    Resultaten
                  </Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/code-create">
                    Vragenlijsten klaarzetten
                  </Link>
                </Button>
              </li>
            </ul>
            <ul className="flex flex-col gap-2">
              <li>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/forms">
                    Formulieren
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
        <PageMain>{children}</PageMain>
      </div>
    </>
  );
}

export default AdminLayout;
