import db from "@/db";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar/index";
import Link from "next/link";
import { getUser } from "@/lib/getUser";

export default async function Form({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;
  const user = await getUser();
  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  if (!currentCode) {
    return <h2>Code niet gevonden</h2>;
  }

  if (
    !!currentCode.userId &&
    (!user || (user && currentCode.userId !== user.id))
  ) {
    return <div>Geen toegang</div>;
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
      <NavBar noLogout />
      <header className="space-y-8 p-8  sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Vragenlijst: {form?.title}
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:px-20 pb-20 grow">
        <p>Bedankt voor het invullen.</p>
        <Button asChild>
          <Link href="/">Naar hoofdpagina</Link>
        </Button>
      </main>
    </div>
  );
}
