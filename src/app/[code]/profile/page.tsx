import db from "@/db";

import NavBar from "@/components/NavBar/index";
import { getFullForm } from "@/lib/getFullForm";
import { getUser } from "@/lib/getUser";
import { getFormUser } from "@/lib/getFormUser";
import FormSessionButton from "@/components/FormSessionButton";
import { redirect } from "next/navigation";
import SignInEmailForm from "@/components/SignInEmailForm";
import { PageMain } from "@/components/PageMain";
import { PageHeader } from "@/components/PageHeader";
import { navigateToSession } from "@/lib/navigateToSession";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LayoutNormal from "@/components/LayoutNormal";

export default async function CodeProfilePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  await navigateToSession(code);

  const user = await getUser();

  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  const formUser = await getFormUser(currentCode);

  if (formUser === "self" || formUser === "superuser")
    redirect(`/${code}`);

  if (!currentCode || formUser === "blocked") {
    return (
      <LayoutNormal>
        <NavBar />
        <PageHeader title="Formulier niet beschikbaar" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </LayoutNormal>
    );
  }

  const codeUserAccount = !!currentCode.userId
    ? await db.query.accounts.findFirst({
        where: (account, { eq }) =>
          eq(account.userId, currentCode.userId as string),
      })
    : undefined;

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

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
      <PageMain>
        {/* user can log in? advise to log in */}
        {!user && !!codeUserAccount && (
          <>
            <p>
              Deze vragenlijst is klaargezet voor een
              bepaalde gebruiker. Wil je de vragenlijst
              invullen gekoppeld aan deze gebruiker? Log dan
              eerst in.
            </p>
          </>
        )}
        {/* user cannot log in: notify */}
        {!user && !codeUserAccount && (
          <>
            <p>
              Deze vragenlijst is klaargezet voor een
              bepaalde gebruiker. Wil je de vragenlijst
              invullen gekoppeld aan deze gebruiker?
              Bevestig je identiteit door het e-mailadres
              waarnaar de uitnodiging is verstuurd in te
              vullen.
            </p>
            <SignInEmailForm code={currentCode.link} />
            <p>
              Lukt dit niet of wil je de vragenlijst anoniem
              invullen?
            </p>
            <FormSessionButton formId={currentCode.formId}>
              Start anonieme vragenlijst
            </FormSessionButton>
          </>
        )}
      </PageMain>
    </LayoutNormal>
  );
}
