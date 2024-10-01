import db from "@/db";
import NavBar from "@/components/NavBar/index";
import AnswerForm from "@/components/AnswerForm";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AnswerPage({
  params,
}: {
  params: { code: string; qid: string };
}) {
  revalidatePath("/[code]/[qid]", "page");
  const { code, qid } = params;
  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  if (!currentCode) {
    return <h2>Code niet gevonden</h2>;
  }

  const form = await db.query.forms.findFirst({
    where: (form, { eq }) =>
      eq(form.id, currentCode.formId),
  });

  if (!form) {
    return <h2>Formulier niet gevonden</h2>;
  }

  const questions = await db.query.questions.findMany({
    where: (ques, { eq }) => eq(ques.formId, form.id),
    with: {
      questionsToOptions: {
        with: {
          option: true,
        },
      },
    },
  });

  const currentQuestion = questions.find(
    (ques) => ques.id.toString() === qid
  );
  const currentIndex = questions.findIndex(
    (ques) => ques.id.toString() === qid
  );

  if (!currentQuestion) {
    return <h2>Vraag niet gevonden</h2>;
  }

  const currentAnswer = await db.query.answers.findFirst({
    where: (ans, { and, eq }) =>
      and(
        eq(ans.code, code),
        eq(ans.questionId, currentQuestion.id)
      ),
    with: {
      answersToOptions: {
        with: {
          option: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar noLogout />
      <header className="space-y-8 p-8  sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Vragenlijst: {form?.title}
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:px-20 pb-20 grow">
        <Suspense fallback={<p>Loading...</p>}>
          <AnswerForm
            code={code}
            answer={currentAnswer}
            question={currentQuestion}
            nextQuestionId={questions[currentIndex + 1]?.id}
            previousQuestionId={
              questions[currentIndex - 1]?.id
            }
          />
        </Suspense>
      </main>
    </div>
  );
}
