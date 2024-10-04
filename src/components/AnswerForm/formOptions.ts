import { formOptions } from "@tanstack/react-form/nextjs";
import { AnswerFull, QuestionFull } from "@/db/types";

const formOpts = (data: {
  code: string;
  formId: string;
  question: QuestionFull;
  answer?: AnswerFull;
}) =>
  formOptions({
    defaultValues: {
      code: data.code,
      formId: data.formId,
      questionKey: data.question.key,
      questionType: data.question.type,
      currentAnswerId: data.answer?.id ?? null,
      text: data.answer?.text ?? "",
      score: data.answer?.score ?? "",
      singleOption: data.answer
        ? data.answer.answersToOptions[0]?.optionId.toString() ??
          ""
        : "",
      options: data.answer
        ? data.answer.answersToOptions?.map((ato) => ({
            explanation: ato.explanation,
            value: ato.optionId.toString(),
          }))
        : [],
      optionsString: "",
    },
  });

export default formOpts;
