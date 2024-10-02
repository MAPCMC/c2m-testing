"use client";

import React from "react";
import { useFormState } from "react-dom";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import handleAnswerFormSubmit from "./action";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../ui/radio-group";

import answers from "@/db/schema/answers";
import questions from "@/db/schema/questions";
import questionsToOptions from "@/db/schema/questionsToOptions";
import dbOptions from "@/db/schema/options";
import answersToOptions from "../../db/schema/answersToOptions";

export default function AnswerForm({
  question,
  code,
  answer,
  nextQuestionId,
  previousQuestionId,
}: {
  answer?: typeof answers.$inferSelect & {
    answersToOptions: (typeof answersToOptions.$inferSelect & {
      option: typeof dbOptions.$inferSelect;
    })[];
  };
  question: typeof questions.$inferSelect & {
    questionsToOptions: (typeof questionsToOptions.$inferSelect & {
      option: typeof dbOptions.$inferSelect;
    })[];
  };
  code: string;
  nextQuestionId: number;
  previousQuestionId: number;
}) {
  const router = useRouter();
  const [state, action] = useFormState(
    handleAnswerFormSubmit,
    initialFormState
  );

  const form = useForm({
    defaultValues: {
      code: code,
      questionId: question.id,
      questionType: question.type,
      currentAnswerId: answer?.id ?? null,
      text: answer?.text ?? "",
      score: answer?.score ?? "",
      singleOption: answer
        ? answer.answersToOptions[0]?.optionId.toString()
        : "",
      options: answer
        ? answer.answersToOptions?.map((a) =>
            a.option.id.toString()
          )
        : [],
    },
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state!),
      [state]
    ),
  });

  const formErrors = form.useStore(
    (formState) => formState.errors
  );

  return (
    <form
      action={action as never}
      onSubmit={() => {
        form.handleSubmit();
      }}
      className="space-y-8 lg:w-1/2 mx-auto"
    >
      <h2 className="text-2xl">{question.label}</h2>
      {formErrors.map((error) => (
        <p className="w-full" key={error as string}>
          {error}
        </p>
      ))}
      {question.questionsToOptions?.length > 0 &&
        (question.type === "multiple" ? (
          <select
            name="options"
            multiple
            // defaultValue={field.state.value}
          >
            {question.questionsToOptions?.map((qto) => (
              <option
                key={qto.option.id}
                value={qto.option.id}
              >
                {qto.option.text ?? qto.option.value}
              </option>
            ))}
          </select>
        ) : (
          <form.Field name="singleOption">
            {(field) => {
              return (
                <RadioGroup
                  name={field.name}
                  onValueChange={(value) =>
                    field.handleChange(value)
                  }
                  value={field.state.value}
                >
                  {question.questionsToOptions?.map(
                    (qto) => (
                      <div
                        key={qto.option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={qto.option.id.toString()}
                          id={qto.option.id.toString()}
                        />
                        <Label
                          htmlFor={qto.option.id.toString()}
                        >
                          {qto.option.text ??
                            qto.option.value}
                        </Label>
                      </div>
                    )
                  )}
                </RadioGroup>
              );
            }}
          </form.Field>
        ))}
      <form.Field name="text">
        {(field) => {
          if (field.state?.value === undefined) return null;
          return (
            <>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </>
          );
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [
          formState.canSubmit,
          formState.isSubmitting,
        ]}
      >
        {([canSubmit, isSubmitting]) => (
          <>
            <Button
              type="submit"
              className="float-right"
              disabled={!canSubmit}
              onClick={() => {
                router.push(
                  `/${code}/${
                    nextQuestionId ?? "result"
                  }` as Route
                );
                router.refresh();
              }}
            >
              {isSubmitting ? "..." : "Volgende"}
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={!canSubmit}
              onClick={() => {
                router.push(
                  `/${code}${
                    previousQuestionId
                      ? `/${previousQuestionId}`
                      : ""
                  }` as Route
                );
                router.refresh();
              }}
            >
              {isSubmitting ? "..." : "Vorige"}
            </Button>
          </>
        )}
      </form.Subscribe>
      <input
        type="hidden"
        name="questionId"
        value={question.id}
      />
      <input
        type="hidden"
        name="questionType"
        value={question.type}
      />
      <input type="hidden" name="code" value={code} />
      <input
        type="hidden"
        name="currentAnswerId"
        value={answer?.id}
      />
    </form>
  );
}
