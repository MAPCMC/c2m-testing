import db from "@/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/getUser";
import { Alert } from "./ui/alert";

const PersonalFormList = async () => {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const personalCodes = await db.query.codes.findMany({
    where: (c, { eq }) => eq(c.userId, user?.id),
  });

  return (
    <section className="grid lg:grid-cols-4 gap-3">
      <h2 className="col-span-full text-xl">
        Persoonlijke vragenlijsten
      </h2>
      {personalCodes.map(async (code) => {
        const form = await db.query.forms.findFirst({
          where: (f, { eq }) => eq(f.id, code.formId),
        });
        if (!form) return null;
        return (
          <article
            key={form.id}
            className="border px-4 py-8 flex flex-col gap-3"
          >
            <h3 className="text-lg">{form.title}</h3>
            <p className="grow">{form.description}</p>
            <Button asChild>
              <Link href={`/${code.link}`}>
                Start vragenlijst
              </Link>
            </Button>
          </article>
        );
      })}
      {personalCodes.length === 0 && (
        <Alert className="col-span-full">
          Er zijn geen vragenlijsten voor je klaargezet
        </Alert>
      )}
    </section>
  );
};

export default PersonalFormList;
