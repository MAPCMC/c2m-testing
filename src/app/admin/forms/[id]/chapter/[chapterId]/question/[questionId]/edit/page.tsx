import React from "react";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import EditFormQuestionForm from "@/components/EditFormQuestionForm";
import db from "@/db";
import { redirect } from "next/navigation";
import EditFormQuestionOptionForm from "@/components/EditFormQuestionOptionForm";
import EditFormQuestionConditionForm from "@/components/EditFormQuestionConditionForm";
import AddFormQuestionOptionForm from "@/components/AddFormQuestionOptionForm";
import AddFormQuestionConditionForm from "@/components/AddFormQuestionConditionForm";
import RemoveButton from "@/components/RemoveButton";
import { removeOption } from "./removeOption";

async function EditFormQuestion({
  params,
}: {
  params: Promise<{
    id: string;
    chapterId: string;
    questionId: string;
  }>;
}) {
  const { id, chapterId, questionId } = await params;
  const question = await db.query.questions.findFirst({
    where: (questions, { eq, isNull, and }) =>
      and(
        eq(questions.id, Number(questionId)),
        isNull(questions.deletedAt)
      ),
  });

  const options = await db.query.questionsToOptions
    .findMany({
      where: (qto, { eq }) =>
        eq(qto.questionId, Number(questionId)),
      with: {
        option: true,
      },
    })
    .then((results) => results.map((r) => r.option));

  const condition =
    await db.query.questionConditions.findFirst({
      where: (questionConditions, { eq }) =>
        eq(
          questionConditions.questionId,
          Number(questionId)
        ),
    });

  const formQuestions = await db.query.formChapters
    .findMany({
      where: (formChapters, { eq, and, isNull }) =>
        and(
          eq(formChapters.formId, id),
          isNull(formChapters.deletedAt)
        ),
      orderBy: (formChapters, { asc }) => [
        asc(formChapters.order),
      ],
      with: {
        questions: {
          where: (questions, { isNull }) =>
            isNull(questions.deletedAt),
          orderBy: (questions, { asc }) => [
            asc(questions.order),
          ],
        },
      },
    })
    .then((results) => results.map((r) => r.questions))
    .then((results) => results.flat())
    .then(async (results) => {
      return await Promise.all(
        results.map(async (q) => {
          const questionOptions =
            await db.query.questionsToOptions
              .findMany({
                where: (qto, { eq }) =>
                  eq(qto.questionId, q.id),
                with: {
                  option: true,
                },
              })
              .then((results) =>
                results.map((r) => r.option)
              );

          return { ...q, options: questionOptions ?? [] };
        })
      );
    });

  if (!question) {
    redirect(
      `/admin/forms/${id}/chapter/${chapterId}/edit`
    );
  }

  return (
    <LayoutAdmin
      headerTitle={`Bewerken: ${question.label}`}
      breadcrumb={[
        {
          title: "Vragenlijst",
          href: `/admin/forms/${id}/edit`,
        },
        {
          title: "Hoofdstuk",
          href: `/admin/forms/${id}/chapter/${chapterId}/edit`,
        },
        {
          title: "Vraag",
          href: `/admin/forms/${id}/chapter/${chapterId}/question/${questionId}/edit`,
        },
      ]}
    >
      <EditFormQuestionForm
        question={question}
        backUri={`/admin/forms/${id}/chapter/${chapterId}/edit`}
      />
      {(question.type === "selection" ||
        question.type === "multiple" ||
        question.type === "multiple_explained") && (
        <>
          <h2 className="text-2xl font-medium">Opties</h2>
          {options.map((option, i) => {
            return (
              <div key={"opt" + option.id + "-" + i}>
                <EditFormQuestionOptionForm
                  option={option}
                  formId={id}
                  chapterId={chapterId}
                  questionId={questionId}
                />
                <RemoveButton
                  schemaName="options"
                  id={option.id}
                  alertTitle="Optie verwijderen"
                  alertDescription="Weet je zeker dat je deze optie wilt verwijderen?"
                  alertConfirm="Verwijderen"
                  alertCancel="Annuleren"
                  customRemove={removeOption}
                >
                  Verwijder optie
                </RemoveButton>
              </div>
            );
          })}
          <AddFormQuestionOptionForm
            formId={id}
            chapterId={chapterId}
            questionId={questionId}
          />
        </>
      )}
      {condition ? (
        <div>
          <EditFormQuestionConditionForm
            condition={condition}
            formId={id}
            formQuestions={formQuestions.filter(
              (q, i) =>
                i <
                formQuestions.findIndex(
                  (q) => q.id === Number(questionId)
                )
            )}
            chapterId={chapterId}
            questionId={questionId}
          />
          <RemoveButton
            schemaName="question_conditions"
            id={condition.id}
            alertTitle="Voorwaarde verwijderen"
            alertDescription="Weet je zeker dat je deze voorwaarde wilt verwijderen?"
            alertConfirm="Verwijderen"
            alertCancel="Annuleren"
          >
            Verwijder voorwaarde
          </RemoveButton>
        </div>
      ) : (
        <AddFormQuestionConditionForm
          formId={id}
          formQuestions={formQuestions.filter(
            (q, i) =>
              i <
              formQuestions.findIndex(
                (q) => q.id === Number(questionId)
              )
          )}
          chapterId={chapterId}
          questionId={questionId}
        />
      )}
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: EditFormQuestion,
  role: "admin",
});
