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
    <section className="space-y-3">
      <h2 className="text-xl font-medium">
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
            className="border px-4 py-3 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-2"
          >
            <div className="flex flex-col gap-2 justify-center">
              <h3 className="text-lg">{form.title}</h3>
              {form.description && (
                <p className="grow">{form.description}</p>
              )}
            </div>

            <Button asChild>
              <Link href={`/${code.link}`}>
                Start vragenlijst
              </Link>
            </Button>
          </article>
        );
      })}
      {personalCodes.length === 0 && (
        <Alert>
          Er zijn geen klaargezette of bestaande
          vragenlijsten.
        </Alert>
      )}
    </section>
  );
};

export default PersonalFormList;
