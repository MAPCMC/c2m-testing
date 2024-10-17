import db from "@/db";
import { getUser } from "@/lib/getUser";
import FormSessionButton from "./FormSessionButton";

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

  if (!forms.length) {
    return null;
  }
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-medium">
        {user
          ? "Andere vragenlijsten"
          : "Anonieme vragenlijsten"}
      </h2>
      <p>
        Kies een nieuwe vragenlijst om te starten.
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
          className="border px-4 py-3 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-2"
        >
          <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-lg">{form.title}</h3>
            {form.description && (
              <p className="grow">{form.description}</p>
            )}
          </div>

          <FormSessionButton formId={form.id}>
            Start {!user && "anonieme"} vragenlijst
          </FormSessionButton>
        </article>
      ))}
    </section>
  );
};

export default FormList;
