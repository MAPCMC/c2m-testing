import db from "@/db";
import { codes } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const FormList = async () => {
  const forms = await db.query.forms.findMany();

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
        .substring(5, 15);
      if (existingCodeLinks.includes(newLink)) {
        newLink = generateCodeLink();
      }
      return newLink;
    };
    const newCodeLink = generateCodeLink();

    await db
      .insert(codes)
      .values({
        formId: data.get("formId"),
        link: newCodeLink,
      })
      .returning();

    redirect(`/${newCodeLink}`);
  };

  return (
    <section className="grid lg:grid-cols-4 gap-3">
      <h2 className="col-span-full text-xl">
        Anonieme vragenlijsten
      </h2>
      {forms.map((form) => (
        <article
          key={form.id}
          className="border px-4 py-8 space-y-3 flex flex-col gap-3"
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
            <Button type="submit">Start vragenlijst</Button>
          </form>
        </article>
      ))}
    </section>
  );
};

export default FormList;
