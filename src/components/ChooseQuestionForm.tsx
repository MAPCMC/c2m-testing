"use client";

import React from "react";
import { redirect } from "next/navigation";
import InnerSelectField from "./InnerSelectField";

export function ChooseQuestionForm({
  questionId,
  questions,
  formId,
  className,
}: {
  questionId: string;
  questions: { id: string; label: string }[];
  formId: string;
  className?: string;
}) {
  return (
    <form className={className}>
      <InnerSelectField
        name="question"
        options={questions.map((question) => ({
          id: question.id,
          text: question.label,
        }))}
        value={questionId}
        label={`Kies een vraag`}
        labelClassName="sr-only"
        onChange={(value) => {
          if (value && value !== questionId)
            redirect(
              `/admin/form-results/${formId}/question/${value}`
            );
        }}
      />
    </form>
  );
}

export default ChooseQuestionForm;
