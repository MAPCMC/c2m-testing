import db from "@/db";

import NavBar from "@/components/NavBar/index";
import { PageHeader } from "@/components/PageHeader";
import { getFormUser } from "@/lib/getFormUser";
import { redirect } from "next/navigation";
import FormStopSessionButton from "@/components/FormStopSessionButton";
import { PageMain } from "@/components/PageMain";

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
    (!user ||
      (user &&
        ![
          currentCode.userId,
          currentCode.createdById,
        ].includes(user.id)))
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
    <>
      <NavBar noLogout />
      <PageHeader title={`Vragenlijst: ${form?.title}`} />
      <PageMain className="*:mx-auto">
        <p>Bedankt voor het invullen.</p>
        <div>
          <FormStopSessionButton>
            Naar de hoofdpagina
          </FormStopSessionButton>
        </div>
      </PageMain>
    </>
  );
}
