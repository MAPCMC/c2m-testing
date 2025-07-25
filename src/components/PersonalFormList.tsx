import db from "@/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/getUser";
import { Alert, AlertTitle } from "./ui/alert";

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
      <h2 className="text-2xl font-medium">
        Persoonlijke vragenlijsten
      </h2>
      {personalCodes.map(async (code) => {
        const form = await db.query.forms.findFirst({
          where: (f, { eq, isNull, and }) =>
            and(eq(f.id, code.formId), isNull(f.deletedAt)),
          with: {
            app: true,
          },
        });

        const app =
          form?.app && form.app.deletedAt === null
            ? form.app
            : null;

        if (!form) return null;
        return (
          <article
            key={form.id}
            className="border px-4 py-3 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-2"
          >
            <div className="flex flex-col gap-2 justify-center">
              <h3 className="text-lg">
                {app?.name && app.name + " | "}
                {form.title}
              </h3>
              {form.description && (
                <div
                  className="lg:col-span-2 prose text-sm"
                  dangerouslySetInnerHTML={{
                    __html: form.description,
                  }}
                ></div>
              )}
            </div>

            <Button asChild>
              <Link href={`/${code.link}`}>
                Start vragenlijst
                <span className="sr-only">
                  : {form.title}
                </span>
              </Link>
            </Button>
          </article>
        );
      })}
      {personalCodes.length === 0 && (
        <Alert>
          <AlertTitle>
            Er zijn geen klaargezette of bestaande
            vragenlijsten.
          </AlertTitle>
        </Alert>
      )}
    </section>
  );
};

export default PersonalFormList;
