export type Question = {
  id: string;
  title: string;
  description?: string;
  options?: string[];
  chapter?: string;
};

export type QuestionChapter = {
  id: string;
  title: string;
  description?: string;
};

export const testQuestionChapters: QuestionChapter[] = [
  {
    id: "1",
    title: "Muzikale ervaring",
  },
  {
    id: "2",
    title: "Over Chorista",
  },
];

const testQuestions: Question[] = [
  {
    id: "1001",
    title: "Wat is je muzikale ervaring?",
    options: ["Beginner", "Gevorderd", "Expert"],
    chapter: "1",
  },
  {
    id: "1002",
    title: "Heb je eerder in een koor gezongen?",
    options: ["Ja", "Nee"],
    chapter: "1",
  },
  {
    id: "1003",
    title: "Wat vond je van de app?",
    chapter: "2",
  },
];

export default testQuestions;
