import db from "@/db";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import NavBar from "@/components/NavBar/index";
import { getFullForm } from "@/lib/getFullForm";
import { redirect } from "next/navigation";
import { getFormUser } from "@/lib/getFormUser";
import FormStopSessionButton from "@/components/FormStopSessionButton";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import { Alert } from "@/components/ui/alert";
import { navigateToSession } from "@/lib/navigateToSession";

export default async function CodePage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;

  await navigateToSession(code);

  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  const formUser = await getFormUser(currentCode);

  if (formUser === "blocked" || !currentCode) {
    return (
      <>
        <NavBar />
        <PageHeader title="Formulier niet beschikbaar" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </>
    );
  }

  if (formUser === "invited") {
    redirect(`${code}/profile`);
  }

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

  if (!form) {
    return (
      <>
        <NavBar />
        <PageHeader title="Formulier niet gevonden" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </>
    );
  }

  return (
    <>
      <NavBar noLogout>
        <FormStopSessionButton />
      </NavBar>
      <PageHeader title={`Vragenlijst: ${form?.title}`} />
      <PageMain className="*:mx-auto">
        {form.app_name && form.app_link && (
          <Alert>
            {form.app_name} nog niet gebruikt? Test de
            applicatie via:{" "}
            <a
              target="_blank"
              href={form.app_link}
              className="hover:underline focus:underline underline-offset-4"
            >
              {form.app_link}
            </a>
          </Alert>
        )}
        <div className="space-y-3">
          {form?.description && <p>{form?.description}</p>}
          <p>
            Vanaf het moment dat u start met het invullen
            van de vragenlijst worden uw antwoorden
            opgeslagen en bewaard. Wilt u uw antwoord op een
            vraag veranderen of wissen? Ga dan terug naar de
            vraag door op “vorige” te klikken, verander of
            wis het antwoord en klik daarna opnieuw op
            “volgende”.
          </p>
          <p>
            Als u (tussentijds) stopt met deelname aan de
            vragenlijst, blijven uw antwoorden bewaard. Als
            u na het invullen toch niet wilt dat uw
            antwoorden gebruikt worden voor het onderzoek,
            kunnen wij uw antwoorden verwijderen. Neem
            hiervoor contact op met de stichting via:{" "}
            <a
              href="mailto:chorista@connect2music.nl"
              className="hover:underline focus:underline underline-offset-4"
            >
              chorista@connect2music.nl
            </a>
            .
          </p>
        </div>
        <div>
          <Button asChild className="mr-3">
            <Link
              href={`/${code}/${form.formChapters[0].questions[0].id}`}
            >
              Volgende
            </Link>
          </Button>
        </div>
      </PageMain>
    </>
  );
}
