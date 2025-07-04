import db from "@/db";
import { FormFull } from "@/db/types";

async function filterConditionalQuestions(
  form: FormFull | undefined,
  code: string
) {
  if (!form) return form;

  const filteredForm = { ...form };

  // Map through chapters
  filteredForm.formChapters = await Promise.all(
    filteredForm.formChapters.map(async (chapter) => {
      const filteredChapter = { ...chapter };

      // For questions, use map + Promise.all, then filter the resolved conditions
      const newQuestions = await Promise.all(
        filteredChapter.questions.map(async (question) => {
          // If no conditions exist, the question passes
          if (
            !question.questionConditions ||
            !question.questionConditions.length
          ) {
            return { question, keep: true }; // pass true if there are no conditions
          }

          // For each condition, we check if it's met
          const conditions = question.questionConditions;

          const conditionMet = await Promise.all(
            conditions.map(async (condition) => {
              try {
                const conditionAnswer =
                  await db.query.answers.findFirst({
                    where: (ans, { and, eq }) =>
                      and(
                        eq(ans.code, code),
                        eq(ans.questionKey, condition.key)
                      ),
                    with: {
                      answersToOptions: {
                        with: {
                          option: true,
                        },
                      },
                    },
                  });

                if (!conditionAnswer) {
                  return false;
                }

                switch (condition.field) {
                  case "text":
                    return true;
                  case "score":
                    return true;
                  case "options":
                    if (
                      condition.requirement === "any" &&
                      conditionAnswer.answersToOptions
                        .length === 0
                    ) {
                      return false;
                    }

                    if (
                      condition.requirement &&
                      (condition.operator === "equals" ||
                        condition.operator === "contains")
                    ) {
                      return conditionAnswer.answersToOptions
                        .map((ato) =>
                          ato.optionId.toString()
                        )
                        .includes(condition.requirement);
                    }

                    if (
                      condition.requirement &&
                      (condition.operator ===
                        "not equals" ||
                        condition.operator ===
                          "not contains")
                    ) {
                      return !conditionAnswer.answersToOptions
                        .map((ato) =>
                          ato.optionId.toString()
                        )
                        .includes(condition.requirement);
                    }
                    return true;
                  default:
                    return true;
                }
              } catch (err) {
                console.error(
                  "Database query to condition answer failed",
                  err
                );
                return false; // handle error gracefully
              }
            })
          );

          // Return question and whether it should be kept
          return {
            question,
            keep: conditionMet.includes(true),
          };
        })
      );

      // Filter questions based on the keep flag
      filteredChapter.questions = newQuestions
        .filter(({ keep }) => keep)
        .map(({ question }) => question);

      return filteredChapter;
    })
  );

  return filteredForm;
}

export async function getFullForm(
  formId: string,
  code: string
) {
  const fullForm = await db.query.forms.findFirst({
    where: (form, { eq }) => eq(form.id, formId),
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
              questionConditions: true,
            },
          },
        },
      },
    },
  });

  const filtered = await filterConditionalQuestions(
    fullForm,
    code
  );

  return filtered;
}
