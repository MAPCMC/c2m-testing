import React from "react";
import FormList from "@/components/FormList";
import PersonalForm from "@/components/PersonalForm/index";
import PersonalFormList from "@/components/PersonalFormList";
import { Suspense } from "react";
import { getUser } from "@/lib/getUser";
import NavBar from "@/components/NavBar/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await getUser();
  return (
    <>
      <NavBar />
      <header className="space-y-8 p-8 sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Connect2Music testportaal
        </h1>
        {!!user && user.role === "superuser" && (
          <nav>
            <ul>
              <li>
                <Button asChild>
                  <Link href="/code-create">
                    Vragenlijsten klaarzetten
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <main className="space-y-8 p-8 sm:px-20 pb-20 grow max-w-3xl">
        <Suspense fallback={<p>Laden vragenlijsten...</p>}>
          <FormList />
          <PersonalFormList />
          {!user && <PersonalForm />}
        </Suspense>
      </main>
    </>
  );
}
