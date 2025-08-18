import {
  answers as answersType,
  answersToOptions,
  options,
} from "@/db/schema";

const prepareExportData = (
  answers: (typeof answersType.$inferSelect & {
    answersToOptions: (typeof answersToOptions.$inferSelect & {
      option: typeof options.$inferSelect;
    })[];
  })[]
) => {
  const exportData: Array<{
    Formulier: string;
    Score: string;
    Antwoord: string;
  }> = [];

  answers.forEach((answer) => {
    let answerText = "";

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

    exportData.push({
      Formulier: answer.code || `answer-${answer.id}`,
      Score: answer.score?.toString() || "",
      Antwoord: answerText,
    });
  });

  return exportData;
};

export default prepareExportData;
