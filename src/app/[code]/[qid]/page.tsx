import db from "@/db";
import NavBar from "@/components/NavBar/index";
import AnswerForm from "@/components/AnswerForm";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { ChapterFull } from "@/db/types";

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
    with: {
      formChapters: {
        orderBy: (formChapters, { asc }) => [
          asc(formChapters.order),
        ],
        with: {
          questions: {
            orderBy: (questions, { asc }) => [
              asc(questions.order),
            ],
            with: {
              questionsToOptions: {
                with: {
                  option: true,
                },
              },
            },
          },
        },
      },
    },
  });

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

  const currentQuestion = currentChapter.questions.find(
    (ques) => ques.id.toString() === qid
  );
  const currentIndex = currentChapter.questions.findIndex(
    (ques) => ques.id.toString() === qid
  );

  if (!currentQuestion || currentIndex === undefined) {
    return <h2>Vraag niet gevonden</h2>;
  }

  const nextQuestionId = () => {
    if (
      currentChapter.questions.length >
      currentIndex + 1
    ) {
      return currentChapter?.questions[currentIndex + 1]
        ?.id;
    }
    if (
      form.formChapters.length >
      currentChapterIndex + 1
    ) {
      return form.formChapters[currentChapterIndex + 1]
        .questions[0]?.id;
    }
  };

  const previousQuestionId = () => {
    if (currentIndex > 0) {
      return currentChapter?.questions[currentIndex - 1]
        ?.id;
    }
    if (currentChapterIndex > 0) {
      return form.formChapters[
        currentChapterIndex - 1
      ].questions.slice(-1)[0]?.id;
    }
  };

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
              Vraag {currentIndex + 1} van{" "}
              {currentChapter.questions.length}
            </p>
            {currentIndex === 0 && (
              <p className="col-span-2">
                {currentChapter.description}
              </p>
            )}
          </article>
          <AnswerForm
            code={code}
            answer={currentAnswer}
            question={currentQuestion}
            nextQuestionId={nextQuestionId()}
            previousQuestionId={previousQuestionId()}
          />
        </Suspense>
      </main>
    </div>
  );
}
