import React from "react";
import FormList from "@/components/FormList";
import PersonalForm from "@/components/PersonalForm/index";
import PersonalFormList from "@/components/PersonalFormList";
import { Suspense } from "react";
import { getUser } from "@/lib/getUser";
import NavBar from "@/components/NavBar/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { redirect } from "next/navigation";
import { PageMain } from "@/components/PageMain";
import { PageHeader } from "@/components/PageHeader";

export default async function Home() {
  const user = await getUser();
  const session = await getServerSession(authOptions);

  // if user is "form user", redirect to current form
  if (session?.user && session.user.id === "anonymous") {
    redirect(`/${session.user.name}`);
  }

  return (
    <>
      <NavBar />
      <PageHeader
        title="Connect2Music testportaal"
        className="space-y-3"
      >
        {!!user &&
          (user.role === "superuser" ||
            user.role === "admin") && (
            <nav>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link href="/admin">
                      Vragenlijsten inzien
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link href="/code-create">
                      Vragenlijsten klaarzetten
                    </Link>
                  </Button>
                </li>
              </ul>
            </nav>
          )}
      </PageHeader>
      <PageMain>
        <Suspense fallback={<p>Laden vragenlijsten...</p>}>
          {!user && <PersonalForm />}
          <PersonalFormList />
          <FormList />
        </Suspense>
      </PageMain>
    </>
  );
}
