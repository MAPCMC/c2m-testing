import Forms from "@/components/Forms";
import PersonalForm from "@/components/PersonalForm/index";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <header className="space-y-8 p-8 sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Connect2Music testportaal
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:p-20 pb-20 grow">
        <p>
          Vul hier je persoonlijke vragenlijstcode in of
          lever een anonieme bijdrage.
        </p>
        <h2 className="text-xl">
          Persoonlijke vragenlijst
          <PersonalForm />
        </h2>
        <Suspense fallback={<p>Laden vragenlijsten...</p>}>
          <Forms />
        </Suspense>
      </main>
    </>
  );
}
