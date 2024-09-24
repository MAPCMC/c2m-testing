import FormList from "@/components/FormList";
import PersonalForm from "@/components/PersonalForm/index";
import PersonalFormList from "@/components/PersonalFormList";
import { Suspense } from "react";
import { getUser } from "@/lib/getUser";
import NavBar from "@/components/NavBar/index";

export default async function Home() {
  // TODO inside suspense
  const user = await getUser();
  return (
    <>
      <NavBar />
      <header className="space-y-8 p-8 sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Connect2Music testportaal
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:p-20 pb-20 grow">
        <Suspense fallback={<p>Laden vragenlijsten...</p>}>
          {!user && (
            <>
              <p>
                Vul hier je persoonlijke vragenlijstcode in
                of lever een anonieme bijdrage.
              </p>
              <h2 className="text-xl">
                Persoonlijke vragenlijst
              </h2>
              <PersonalForm />
              <FormList />
            </>
          )}
          <PersonalFormList />
        </Suspense>
      </main>
    </>
  );
}
