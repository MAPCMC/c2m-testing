import forms from "@/db/schema/forms";
import formChapters from "@/db/schema/formChapters";
import questions from "@/db/schema/questions";
import questionsToOptions from "@/db/schema/questionsToOptions";
import options from "@/db/schema/options";
import answers from "@/db/schema/answers";
import answersToOptions from "@/db/schema/answersToOptions";
import { questionConditions } from "./schema";

export type AnswerFull = typeof answers.$inferSelect & {
  answersToOptions: (typeof answersToOptions.$inferSelect & {
    option: typeof options.$inferSelect;
  })[];
};

export type QuestionFull = typeof questions.$inferSelect & {
  questionsToOptions: (typeof questionsToOptions.$inferSelect & {
    option: typeof options.$inferSelect;
  })[];
  questionConditions: (typeof questionConditions.$inferSelect)[];
};

export type ChapterFull =
  typeof formChapters.$inferSelect & {
    questions: QuestionFull[];
  };

export type FormFull = typeof forms.$inferSelect & {
  formChapters: ChapterFull[];
};
