import db from "@/db";
import { codes } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/getUser";

const FormList = async () => {
  const user = await getUser();

  const userCodes = await db.query.codes.findMany({
    where: user
      ? (codes, { eq }) => eq(codes.userId, user.id)
      : undefined,
    columns: {
      formId: true,
    },
  });
  const userFormIds = userCodes.map((code) => code.formId);

  const forms = await db.query.forms.findMany({
    where: user
      ? (forms, { notInArray }) =>
          notInArray(forms.id, userFormIds)
      : undefined,
  });

  const handleFormStart = async (data: FormData) => {
    "use server";
    const existingCodeLinks = await db.query.codes.findMany(
      {
        columns: {
          link: true,
        },
      }
    );

    const generateCodeLink = () => {
      let newLink = Math.random()
        .toString(36)
        .substring(2, 12);
      if (
        existingCodeLinks.find(
          (code) => code.link === newLink
        )
      ) {
        newLink = generateCodeLink();
      }

      return newLink;
    };
    const newCodeLink = generateCodeLink();

    await db
      .insert(codes)
      .values({
        formId: data.get("formId")?.toString() ?? "",
        link: newCodeLink,
        userId: !!user ? user.id : null,
      })
      .returning();

    redirect(`/${newCodeLink}`);
  };

  if (!forms.length) {
    return null;
  }
  return (
    <section className="grid lg:grid-cols-2 gap-2">
      <h2 className="col-span-full text-2xl font-medium">
        Anonieme vragenlijsten
      </h2>
      <p className="col-span-full">
        Kies een vragenlijst om te starten.
        {!user && (
          <span>
            {" "}
            Deze vragenlijsten zijn anoniem. Aan het begin
            van de vragenlijst stellen we een aantal
            profielvragen om de resultaten te kunnen
            analyseren. Log in om deze gegevens te bewaren
            voor latere vragenlijsten.
          </span>
        )}
      </p>
      {forms.map((form) => (
        <article
          key={form.id}
          className="border p-4 space-y-2 rounded-md"
        >
          <h3 className="text-lg">{form.title}</h3>
          <p className="grow">{form.description}</p>
          <form action={handleFormStart}>
            <input
              name="formId"
              className="hidden"
              value={form.id}
              readOnly
            />
            <Button type="submit" className="w-full">
              Start vragenlijst
            </Button>
          </form>
        </article>
      ))}
    </section>
  );
};

export default FormList;
