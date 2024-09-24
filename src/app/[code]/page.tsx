import db from "@/db";
import { Button } from "@/components/ui/button";
import testQuestions from "@/data/questions";
import Link from "next/link";

export default async function Form({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;
  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  if (!currentCode) {
    return <div>Code niet gevonden</div>;
  }

  const form = await db.query.forms.findFirst({
    where: (form, { eq }) =>
      eq(form.id, currentCode.formId),
  });

  if (!form) {
    return <div>Formulier niet gevonden</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="space-y-8 p-8  sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Vragenlijst: {form?.title}
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:p-20 pb-20 grow">
        <p>{form?.description}</p>
        <p>
          Vanaf het moment dat u start met het invullen van
          de vragenlijst worden uw antwoorden opgeslagen en
          bewaard. Wilt u uw antwoord op een vraag
          veranderen of wissen? Ga dan terug naar de vraag
          door op “vorige” te klikken, verander of wis het
          antwoord en klik daarna opnieuw op “volgende”.
        </p>
        <p>
          Als u (tussentijds) stopt met deelname aan de
          vragenlijst, blijven uw antwoorden bewaard. Als u
          na het invullen toch niet wilt dat uw antwoorden
          gebruikt worden voor het onderzoek, kunnen wij uw
          antwoorden verwijderen. [contactgegevens]
        </p>
        <Button asChild>
          <Link href={`/${code}/${testQuestions[0].id}`}>
            Volgende
          </Link>
        </Button>
      </main>
    </div>
  );
}
