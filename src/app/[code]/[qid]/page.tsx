import db from "@/db";
import { Button } from "@/components/ui/button";
import testQuestions from "@/data/questions";
import Link from "next/link";

export default async function Form({
  params,
}: {
  params: { code: string; qid: string };
}) {
  const { code, qid } = params;
  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  if (!currentCode) {
    return <div>Code niet gevonden</div>;
  }

  const form = await db.query.forms.findFirst({
    where: (form, { eq }) =>
      eq(form.id, currentCode.formId),
  });

  if (!form) {
    return <div>Formulier niet gevonden</div>;
  }

  const question = testQuestions.find(
    (ques) => ques.id === qid
  );
  const index = testQuestions.findIndex(
    (ques) => ques.id === qid
  );

  if (!form) {
    return <div>Form not found</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="space-y-8 p-8  sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Vragenlijst: {form?.title}
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:p-20 pb-20 grow">
        <h2>{question?.title}</h2>
        {!!testQuestions[index - 1] ? (
          <Button asChild>
            <Link
              href={`/${code}/${
                testQuestions[index - 1].id
              }`}
            >
              Vorige
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/${code}`}>Vorige</Link>
          </Button>
        )}
        {!!testQuestions[index + 1] ? (
          <Button asChild>
            <Link
              href={`/${code}/${
                testQuestions[index + 1].id
              }`}
            >
              Volgende
            </Link>
          </Button>
        ) : (
          <Button asChild variant="destructive">
            <Link href={`/${code}/result`}>Afronden</Link>
          </Button>
        )}
      </main>
    </div>
  );
}
