import { createServerValidate } from "@tanstack/react-form/nextjs";
import formOptions from "../formOptions";

export const serverValidate = createServerValidate({
  ...formOptions({
    code: "test",
    formId: "test",
    question: {
      id: 1,
      description: "test",
      formChapterId: 1,
      order: 1,
      label: "test",
      type: "text",
      key: "test",
      score_high_description: null,
      score_low_description: null,
      questionsToOptions: [],
      questionConditions: [],
    },
    answer: {
      id: 1,
      code: "test",
      questionKey: "test",
      text: null,
      score: null,
      profileId: null,
      answersToOptions: [],
    },
  }),
  onServerValidate: ({ value }) => {
    if (
      value.questionType === "multiple" &&
      !value.optionsString
    ) {
      return "Opties worden niet gelezen. Neem contact op met de beheerder.";
    }

    if (
      value.questionType === "score" &&
      !!value.score &&
      !["1", "2", "3", "4", "5", "nvt"].includes(
        value.score
      )
    ) {
      return "Score moet tussen 1 en 5 liggen.";
    }

    if (!value.questionKey || !value.code) {
      return "Kan vraag niet beantwoorden. Neem contact op met de beheerder.";
    }
  },
});
