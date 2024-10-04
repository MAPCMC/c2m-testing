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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import answers from "@/db/schema/answers";
import dbOptions from "@/db/schema/options";
import answersToOptions from "@/db/schema/answersToOptions";
import { QuestionFull } from "@/db/types";
import formOpts from "./formOptions";
import { Textarea } from "../ui/textarea";

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
  question: QuestionFull;
  code: string;
  nextQuestionId?: number;
  previousQuestionId?: number;
}) {
  const router = useRouter();
  const [state, action] = useFormState(
    handleAnswerFormSubmit,
    initialFormState
  );

  const form = useForm({
    ...formOpts({
      code,
      question,
      answer,
    }),
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
      className="space-y-4"
    >
      <h2 className="text-2xl">{question.label}</h2>
      <p className="text-sm">{question.description}</p>
      {formErrors.map((error) => (
        <p className="w-full" key={error as string}>
          {error}
        </p>
      ))}
      {(() => {
        switch (question.type) {
          case "number":
            return (
              <form.Field
                name="text"
                validators={{
                  onChange: ({ value }) => {
                    const isNumeric = (string: string) =>
                      /^[+-]?\d+(\.\d+)?$/.test(string);
                    if (!!value && !isNumeric(value))
                      return "Vul een getal in";
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  if (field.state?.value === undefined)
                    return null;
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
                      {field.state.meta.errors.map(
                        (error) => (
                          <p key={error as string}>
                            {error}
                          </p>
                        )
                      )}
                    </>
                  );
                }}
              </form.Field>
            );
          case "text":
            return (
              <form.Field name="text">
                {(field) => {
                  if (field.state?.value === undefined)
                    return null;
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
                      {field.state.meta.errors.map(
                        (error) => (
                          <p key={error as string}>
                            {error}
                          </p>
                        )
                      )}
                    </>
                  );
                }}
              </form.Field>
            );
          case "textarea":
            return (
              <form.Field name="text">
                {(field) => {
                  if (field.state?.value === undefined)
                    return null;
                  return (
                    <>
                      <Textarea
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                      />
                      {field.state.meta.errors.map(
                        (error) => (
                          <p key={error as string}>
                            {error}
                          </p>
                        )
                      )}
                    </>
                  );
                }}
              </form.Field>
            );
          case "selection":
            return (
              <>
                <form.Field name="singleOption">
                  {(field) => {
                    if (field.state?.value === undefined)
                      return null;

                    return (
                      <>
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
                        {field.state.meta.errors.map(
                          (error) => (
                            <p key={error as string}>
                              {error}
                            </p>
                          )
                        )}
                      </>
                    );
                  }}
                </form.Field>
                <form.Field name="text">
                  {(field) => {
                    if (field.state?.value === undefined)
                      return null;
                    return (
                      <div className="pb-6">
                        <Label htmlFor={field.name}>
                          extra toelichting
                        </Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value
                            )
                          }
                        />
                        {field.state.meta.errors.map(
                          (error) => (
                            <p key={error as string}>
                              {error}
                            </p>
                          )
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              </>
            );
          case "multiple":
            return (
              <form.Field name="options" mode="array">
                {(field) => {
                  if (field.state?.value === undefined)
                    return null;

                  return (
                    <>
                      {question.questionsToOptions?.map(
                        (qto) => (
                          <React.Fragment
                            key={qto.option.id}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={
                                  !!field.state.value.find(
                                    (v) =>
                                      v.value ===
                                      qto.option.id.toString()
                                  )
                                }
                                onCheckedChange={(
                                  checked
                                ) => {
                                  if (checked) {
                                    field.handleChange([
                                      ...field.state.value,
                                      {
                                        value:
                                          qto.option.id.toString(),
                                        explanation:
                                          field.state.value.find(
                                            (v) =>
                                              v.value ===
                                              qto.option.id.toString()
                                          )?.explanation ??
                                          "",
                                      },
                                    ]);
                                  } else {
                                    field.handleChange(
                                      field.state.value.filter(
                                        (v) =>
                                          v.value !==
                                          qto.option.id.toString()
                                      )
                                    );
                                  }
                                }}
                                id={`${field.name}${qto.option.id}`}
                              />
                              <Label
                                htmlFor={`${field.name}${qto.option.id}`}
                              >
                                {qto.option.text ??
                                  qto.option.value}
                              </Label>
                            </div>
                            {!!field.state.value.find(
                              (v) =>
                                v.value ===
                                qto.option.id.toString()
                            ) && (
                              <div className="pb-6">
                                <Label
                                  htmlFor={`${field.name}${qto.option.id}explanation`}
                                >
                                  toelichting
                                </Label>
                                <Input
                                  id={`${field.name}${qto.option.id}explanation`}
                                  defaultValue={
                                    field.state.value.find(
                                      (v) =>
                                        v.value ===
                                        qto.option.id.toString()
                                    )?.explanation ?? ""
                                  }
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(
                                      field.state.value.map(
                                        (v) =>
                                          v.value ===
                                          qto.option.id.toString()
                                            ? {
                                                ...v,
                                                explanation:
                                                  e.target
                                                    .value,
                                              }
                                            : v
                                      )
                                    )
                                  }
                                />
                              </div>
                            )}
                          </React.Fragment>
                        )
                      )}
                      {field.state.meta.errors.map(
                        (error) => (
                          <p key={error as string}>
                            {error}
                          </p>
                        )
                      )}
                      <input
                        type="hidden"
                        name="optionsString"
                        value={JSON.stringify(
                          field.state.value
                        )}
                      />
                    </>
                  );
                }}
              </form.Field>
            );
          case "score":
            return (
              <>
                <form.Field name="score">
                  {(field) => {
                    if (field.state?.value === undefined)
                      return null;
                    return (
                      <>
                        <RadioGroup
                          name={field.name}
                          onValueChange={(value) =>
                            field.handleChange(value)
                          }
                          value={field.state.value}
                          className="grid grid-cols-5 gap-2"
                        >
                          {[
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "nvt",
                          ].map((scoreValue) => (
                            <div
                              key={scoreValue}
                              className={
                                "flex flex-col items-center gap-3 relative" +
                                (scoreValue === "nvt"
                                  ? " col-span-5"
                                  : "")
                              }
                            >
                              <RadioGroupItem
                                value={scoreValue}
                                id={scoreValue}
                              />
                              <Label
                                htmlFor={scoreValue}
                                className="after:w-full after:h-full after:absolute after:content-[''] after:inset-0"
                              >
                                {scoreValue === "nvt"
                                  ? "geen mening"
                                  : scoreValue}
                              </Label>
                              {scoreValue === "1" && (
                                <p className="text-sm text-center">
                                  {
                                    question.score_low_description
                                  }
                                </p>
                              )}
                              {scoreValue === "5" && (
                                <p className="text-sm text-center">
                                  {
                                    question.score_high_description
                                  }
                                </p>
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                        {field.state.meta.errors.map(
                          (error) => (
                            <p key={error as string}>
                              {error}
                            </p>
                          )
                        )}
                      </>
                    );
                  }}
                </form.Field>
                <form.Field name="text">
                  {(field) => {
                    if (field.state?.value === undefined)
                      return null;
                    return (
                      <>
                        <Label
                          htmlFor={field.name}
                          className="pt-8 block"
                        >
                          toelichting
                        </Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value
                            )
                          }
                        />
                        {field.state.meta.errors.map(
                          (error) => (
                            <p key={error as string}>
                              {error}
                            </p>
                          )
                        )}
                      </>
                    );
                  }}
                </form.Field>
              </>
            );
          default:
            return null;
        }
      })()}
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
        name="questionKey"
        value={question.key}
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
