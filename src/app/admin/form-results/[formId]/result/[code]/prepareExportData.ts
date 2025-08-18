import {
  forms,
  answers as answersType,
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
  answers: (typeof answersType.$inferSelect & {
    answersToOptions: (typeof answersToOptions.$inferSelect & {
      option: typeof options.$inferSelect;
    })[];
  })[]
) => {
  const exportData: Array<{
    Hoofdstuk: string;
    Vraag: string;
    Score: string;
    Antwoord: string;
  }> = [];

  form.formChapters.forEach((chapter) => {
    chapter.questions.forEach((question) => {
      const answer = answers.find(
        (a) => a.questionKey === question.key
      );
      let answerText = "";
      let score = "";

      if (answer) {
        score = answer.score?.toString() || "";

        // Handle different answer types
        if (answer.answersToOptions?.length > 0) {
          const answerParts = answer.answersToOptions.map(
            (ao) => {
              let part = ao.option?.text || "";
              if (ao.explanation) {
                part += `: ${ao.explanation}`;
              }
              return part;
            }
          );
          answerText = answerParts.join("; ");
        } else if (answer.text) {
          answerText = answer.text;
        }
      }

      exportData.push({
        Hoofdstuk: chapter.title,
        Vraag: question.label,
        Score: score,
        Antwoord: answerText,
      });
    });
  });

  return exportData;
};

export default prepareExportData;
