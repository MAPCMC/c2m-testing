import db from "@/db";
import NavBar from "@/components/NavBar/index";
import AnswerForm from "@/components/AnswerForm";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function AnswerPage({
  params,
}: {
  params: { code: string; qid: string };
}) {
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

  const testQuestions = await db.query.questions.findMany();

  const question = testQuestions.find(
    (ques) => ques.id.toString() === qid
  );
  const index = testQuestions.findIndex(
    (ques) => ques.id.toString() === qid
  );

  if (!question) {
    return <h2>Vraag niet gevonden</h2>;
  }

  const setNextUrl = () => {
    if (!!testQuestions[index + 1]) {
      return `/${code}/${testQuestions[index + 1].id}`;
    } else {
      return `/${code}/result`;
    }
  };

  const setPreviousUrl = () => {
    if (!!testQuestions[index - 1]) {
      return `/${code}/${testQuestions[index - 1].id}`;
    } else {
      return `/${code}`;
    }
  };

  const next = setNextUrl();
  const previous = setPreviousUrl();

  const currentAnswer = await db.query.answers.findFirst({
    where: (ans, { and, eq }) =>
      and(
        eq(ans.code, code),
        eq(ans.questionId, question.id)
      ),
  });

  console.log(currentAnswer, question.id);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar noLogout />
      <header className="space-y-8 p-8  sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Vragenlijst: {form?.title}
        </h1>
      </header>
      <main className="space-y-8 p-8 sm:px-20 pb-20 grow">
        <AnswerForm
          answer={currentAnswer}
          question={question}
          code={code}
          nextUrl={next}
          previousUrl={previous}
        />
      </main>
    </div>
  );
}
