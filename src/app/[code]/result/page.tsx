import db from "@/db";

import NavBar from "@/components/NavBar/index";
import { PageHeader } from "@/components/PageHeader";
import { getFormUser } from "@/lib/getFormUser";
import { redirect } from "next/navigation";
import FormStopSessionButton from "@/components/FormStopSessionButton";
import { PageMain } from "@/components/PageMain";
import { navigateToSession } from "@/lib/navigateToSession";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LayoutNormal from "@/components/LayoutNormal";

export default async function Form({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  await navigateToSession(code);

  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  const formUser = await getFormUser(currentCode);

  if (formUser === "blocked" || !currentCode) {
    return <div>Formulier niet beschikbaar</div>;
  }

  if (formUser === "invited") {
    redirect(`${code}/profile`);
  }

  const form = await db.query.forms.findFirst({
    where: (form, { eq }) =>
      eq(form.id, currentCode.formId),
  });

  if (!form) {
    return (
      <LayoutNormal>
        <NavBar />
        <PageHeader title="Formulier niet gevonden" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </LayoutNormal>
    );
  }

  return (
    <LayoutNormal>
      <NavBar noLogout />
      <PageHeader title={`Vragenlijst: ${form?.title}`} />
      <PageMain className="*:mx-auto">
        <div className="space-y-2">
          <p>Bedankt voor het invullen.</p>
          {formUser === "anonymous" && (
            <p>
              Via &quot;Vragenlijst afsluiten&quot; sluit je
              deze vragenlijst. Omdat de vragenlijst anoniem
              is ingevuld, kunnen antwoorden daarna niet
              meer worden gewijzigd of ingezien.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <FormStopSessionButton />
          <BackButton variant="outline" />
        </div>
      </PageMain>
    </LayoutNormal>
  );
}
