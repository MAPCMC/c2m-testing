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
import LayoutNormal from "@/components/LayoutNormal";

export const dynamic = "force-dynamic";

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ code: string; qid: string }>;
}) {
  const { code, qid } = await params;

  await navigateToSession(code);

  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq }) => eq(c.link, code),
  });

  const formUser = await getFormUser(currentCode);

  if (!currentCode || formUser === "blocked") {
    return (
      <LayoutNormal>
        <NavBar />
        <PageHeader title="Formulier niet beschikbaar" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </LayoutNormal>
    );
  }

  if (formUser === "invited") {
    return redirect(`/${code}`);
  }

  const form = await getFullForm(
    currentCode.formId,
    currentCode.link
  );

  if (!form) {
    return (
      <LayoutNormal>
        <NavBar />
        <PageHeader title="Formulier niet gevonden" />
        <PageMain>
          <Button asChild>
            <Link href="/">Naar de hoofdpagina</Link>
          </Button>
        </PageMain>
      </LayoutNormal>
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
      <LayoutNormal>
        <NavBar noLogout />
        <PageHeader title={`Vragenlijst: ${form?.title}`} />
        <PageMain>
          <p>Hoofdstuk niet gevonden</p>
        </PageMain>
      </LayoutNormal>
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
    <LayoutNormal>
      <NavBar noLogout />
      <PageHeader title={`Vragenlijst: ${form?.title}`} />
      <PageMain className="*:mx-auto">
        <Suspense fallback={<p>Aan het laden...</p>}>
          <article className="lg:gap-4 lg:grid space-y-2 lg:grid-cols-[auto_auto]">
            <h2 className="font-bold">
              Hoofdstuk {currentChapterIndex + 1}:{" "}
              {currentChapter.title}
            </h2>
            <p className="text-sm lg:text-right">
              Vraag {currentQuestionIndex + 1} van{" "}
              {currentChapter.questions.length}
            </p>
            {currentQuestionIndex === 0 &&
              !!currentChapter.description && (
                <div
                  className="lg:col-span-2 prose"
                  dangerouslySetInnerHTML={{
                    __html: currentChapter.description,
                  }}
                ></div>
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
    </LayoutNormal>
  );
}
