import db from "@/db";
import NavBar from "@/components/NavBar/index";
import AnswerForm from "@/components/AnswerForm";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { ChapterFull, QuestionFull } from "@/db/types";
import { getFullForm } from "@/lib/getFullForm";
import { getUser } from "@/lib/getUser";

export const dynamic = "force-dynamic";

export default async function AnswerPage({
  params,
}: {
  params: { code: string; qid: string };
}) {
  const { code, qid } = params;
  const user = await getUser();
  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  if (!currentCode) {
    return <h2>Code niet gevonden</h2>;
  }

  if (
    !!currentCode.userId &&
    (!user || (user && currentCode.userId !== user.id))
  ) {
    return <div>Geen toegang</div>;
  }

  // refresh
  revalidatePath("/[code]/[qid]", "page");

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

  if (!form) {
    return <h2>Formulier niet gevonden</h2>;
  }

  const { currentChapter, currentChapterIndex } =
    form.formChapters.reduce<{
      currentChapter: ChapterFull | null;
      currentChapterIndex: number;
    }>(
      (result, chapter, index) => {
        if (
          !result.currentChapter &&
          chapter.questions.find(
            (q) => q.id.toString() === qid
          )
        ) {
          result.currentChapter = chapter;
          result.currentChapterIndex = index;
        }
        return result;
      },
      { currentChapter: null, currentChapterIndex: -1 }
    );

  if (!currentChapter) {
    return <h2>Hoofdstuk niet gevonden</h2>;
  }

  const { currentQuestion, currentQuestionIndex } =
    currentChapter.questions.reduce<{
      currentQuestion: QuestionFull | null;
      currentQuestionIndex: number;
    }>(
      (result, question, index) => {
        if (
          !result.currentQuestion &&
          question.id.toString() === qid
        ) {
          result.currentQuestion = question;
          result.currentQuestionIndex = index;
        }
        return result;
      },
      { currentQuestion: null, currentQuestionIndex: -1 }
    );

  if (
    !currentQuestion ||
    currentQuestionIndex === undefined
  ) {
    return <h2>Vraag niet gevonden</h2>;
  }

  const currentAnswer = await db.query.answers.findFirst({
    where: (ans, { and, eq }) =>
      and(
        eq(ans.code, code),
        eq(ans.questionKey, currentQuestion.key)
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
      <header className="space-y-8 p-6  sm:px-20 pb-20">
        <h1 className="text-2xl font-bold">
          Vragenlijst: {form?.title}
        </h1>
      </header>
      <main className="space-y-12 w-full md:max-w-3xl mx-auto px-6 sm:px-20 pb-20 grow">
        <Suspense fallback={<p>Aan het laden...</p>}>
          <article className="gap-4 grid grid-cols-2">
            <h2 className="font-bold">
              Hoofdstuk {currentChapterIndex + 1}:{" "}
              {currentChapter.title}
            </h2>
            <p className="text-sm text-right">
              Vraag {currentQuestionIndex + 1} van{" "}
              {currentChapter.questions.length}
            </p>
            {currentQuestionIndex === 0 && (
              <p className="col-span-2">
                {currentChapter.description}
              </p>
            )}
          </article>
          <AnswerForm
            formId={form.id}
            code={code}
            answer={currentAnswer}
            question={currentQuestion}
          />
        </Suspense>
      </main>
    </div>
  );
}
