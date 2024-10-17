import db from "@/db";
import NavBar from "@/components/NavBar/index";
import AnswerForm from "@/components/AnswerForm";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { ChapterFull, QuestionFull } from "@/db/types";
import { getFullForm } from "@/lib/getFullForm";
import { getFormUser } from "@/lib/getFormUser";
import { PageHeader } from "@/components/PageHeader";
import { PageMain } from "@/components/PageMain";
import { navigateToSession } from "@/lib/navigateToSession";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnswerPage({
  params,
}: {
  params: { code: string; qid: string };
}) {
  const { code, qid } = params;

  await navigateToSession(code);

  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  const formUser = await getFormUser(currentCode);

  if (!currentCode || formUser === "blocked") {
    return (
      <>
        <NavBar />
        <PageHeader title="Formulier niet beschikbaar" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </>
    );
  }

  if (formUser === "invited") {
    return redirect(`/${code}`);
  }

  // refresh
  revalidatePath("/[code]/[qid]", "page");

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

  if (!form) {
    return (
      <>
        <NavBar />
        <PageHeader title="Formulier niet gevonden" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </>
    );
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
    return (
      <>
        <NavBar noLogout />
        <PageHeader title={`Vragenlijst: ${form?.title}`} />
        <PageMain>
          <p>Hoofdstuk niet gevonden</p>
        </PageMain>
      </>
    );
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
    <>
      <NavBar noLogout />
      <PageHeader title={`Vragenlijst: ${form?.title}`} />
      <PageMain className="*:mx-auto">
        <Suspense fallback={<p>Aan het laden...</p>}>
          <article className="lg:gap-4 lg:grid space-y-2 lg:grid-cols-2">
            <h2 className="font-bold">
              Hoofdstuk {currentChapterIndex + 1}:{" "}
              {currentChapter.title}
            </h2>
            <p className="text-sm lg:text-right">
              Vraag {currentQuestionIndex + 1} van{" "}
              {currentChapter.questions.length}
            </p>
            {currentQuestionIndex === 0 && (
              <p className="lg:col-span-2">
                {currentChapter.description}
              </p>
            )}
          </article>
          <AnswerForm
            formId={form.id}
            code={code}
            answer={currentAnswer}
            question={currentQuestion}
            // addAnswerToProfile={
            //   currentChapter.addAnswersToProfile
            // }
          />
        </Suspense>
      </PageMain>
    </>
  );
}
