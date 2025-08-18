import {
  forms,
  answers,
  formChapters,
  questions,
  questionsToOptions,
  answersToOptions,
  options,
} from "@/db/schema";

const escapeCsvValue = (value: string): string => {
  if (value === null || value === undefined) return "";
  // Escape double quotes by doubling them
  const escaped = value.toString().replace(/"/g, '""');
  // Wrap in quotes if contains comma, newline, or double quote
  if (
    escaped.includes(",") ||
    escaped.includes("\n") ||
    escaped.includes('"')
  ) {
    return `"${escaped}"`;
  }
  return escaped;
};

const prepareExportData = (
  form: typeof forms.$inferSelect & {
    formChapters: (typeof formChapters.$inferSelect & {
      questions: (typeof questions.$inferSelect & {
        questionsToOptions: (typeof questionsToOptions.$inferSelect & {
          option: typeof options.$inferSelect;
        })[];
      })[];
    })[];
  },
  answersByQuestion: Record<
    string,
    (typeof answers.$inferSelect & {
      answersToOptions: (typeof answersToOptions.$inferSelect & {
        option: typeof options.$inferSelect;
      })[];
    })[]
  >
) => {
  // First, collect all unique questions with their full paths and types
  const questionsList = form.formChapters.flatMap(
    (chapter) =>
      chapter.questions.map((question) => ({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        questionKey: question.key,
        questionText: question.label,
        questionType: question.type,
        // Include question options for reference
        options:
          question.questionsToOptions?.map(
            (qto) => qto.option
          ) || [],
      }))
  );

  // Create a map of answer codes to their answer objects
  const answersByCode = new Map<
    string,
    Map<string, string>
  >();

  // Process all answers to group by answer code
  Object.entries(answersByQuestion).forEach(
    ([questionKey, answers]) => {
      const question = questionsList.find(
        (q) => q.questionKey === questionKey
      );
      if (!question) return;

      answers.forEach((answer) => {
        const answerCode =
          answer.code || `answer-${answer.id}`;

        if (!answersByCode.has(answerCode)) {
          answersByCode.set(answerCode, new Map());
        }

        const answerMap = answersByCode.get(answerCode)!;
        let answerText = "";

        // Process answer based on question type
        switch (question.questionType) {
          case "score":
            answerText = answer.score || "";
            if (answer.text) {
              answerText += answerText
                ? `, ${answer.text}`
                : answer.text;
            }
            break;

          case "multiple":
            if (answer.answersToOptions?.length > 0) {
              answerText = answer.answersToOptions
                .map((ao) =>
                  escapeCsvValue(ao.option?.text || "")
                )
                .filter(Boolean)
                .join(" | ");
            }
            break;

          case "multiple_explained":
            if (answer.answersToOptions?.length > 0) {
              answerText = answer.answersToOptions
                .map((ao) => {
                  const optionText = escapeCsvValue(
                    ao.option?.text || ""
                  );
                  const explanation = ao.explanation
                    ? `, ${escapeCsvValue(ao.explanation)}`
                    : "";
                  return `${optionText}${explanation}`;
                })
                .filter(Boolean)
                .join(" | ");
            }
            break;

          case "selection":
            const selectedOptions =
              answer.answersToOptions
                ?.map((ao) =>
                  escapeCsvValue(ao.option?.text || "")
                )
                .filter(Boolean) || [];

            if (answer.text) {
              selectedOptions.push(
                escapeCsvValue(answer.text)
              );
            }
            answerText = selectedOptions.join(", ");
            break;

          case "text":
          case "textarea":
          case "number":
          default:
            answerText = escapeCsvValue(answer.text || "");
            break;
        }

        answerMap.set(questionKey, answerText);
      });
    }
  );

  // Convert to the final export format
  const exportData = Array.from(
    answersByCode.entries()
  ).map(([answerCode, questionAnswers]) => {
    const row: Record<string, string> = {
      Antwoordcode: answerCode,
    };

    // Add all questions as columns
    questionsList.forEach((q) => {
      const value =
        questionAnswers.get(q.questionKey) || "";
      // Don't escape here, let the ExportButton handle it
      row[q.questionText] = value;
    });

    return row;
  });

  return exportData;
};

export default prepareExportData;
