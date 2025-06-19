"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form";

import handleAnswerFormSubmit from "./action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import answers from "@/db/schema/answers";
import dbOptions from "@/db/schema/options";
import answersToOptions from "@/db/schema/answersToOptions";
import { QuestionFull } from "@/db/types";
import formOpts from "./formOptions";
import { Textarea } from "../ui/textarea";
import InnerField from "./components/InnerField";
import InnerChoiceField from "./components/InnerChoiceField";
import InnerScoreField from "./components/InnerScoreField";

export default function AnswerForm({
  question,
  code,
  formId,
  answer,
}: {
  answer?: typeof answers.$inferSelect & {
    answersToOptions: (typeof answersToOptions.$inferSelect & {
      option: typeof dbOptions.$inferSelect;
    })[];
  };
  question: QuestionFull;
  code: string;
  formId: string;
  nextQuestionId?: number;
  previousQuestionId?: number;
}) {
  const [state, action] = useActionState(
    handleAnswerFormSubmit,
    initialFormState
  );

  const form = useForm({
    ...formOpts({
      code,
      formId,
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
      {formErrors.map((error) => (
        <p
          key={error as string}
          aria-live="assertive"
          className="text-sm font-medium text-destructive"
        >
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
                {(field) => (
                  <InnerField
                    label={question.label}
                    description={question.description}
                    value={field.state.value}
                    name={field.name}
                    errors={field.state.meta.errors}
                    question={question}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                  />
                )}
              </form.Field>
            );
          case "text":
            return (
              <form.Field name="text">
                {(field) => (
                  <InnerField
                    label={question.label}
                    description={question.description}
                    value={field.state.value}
                    name={field.name}
                    errors={field.state.meta.errors}
                    question={question}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                  />
                )}
              </form.Field>
            );
          case "textarea":
            return (
              <form.Field name="text">
                {(field) => (
                  <InnerField
                    label={question.label}
                    description={question.description}
                    as={Textarea}
                    value={field.state.value}
                    name={field.name}
                    errors={field.state.meta.errors}
                    question={question}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value)
                    }
                  />
                )}
              </form.Field>
            );
          case "selection":
            return (
              <>
                <form.Field name="singleOption">
                  {(field) => (
                    <InnerChoiceField
                      label={question.label}
                      description={question.description}
                      value={field.state.value}
                      name={field.name}
                      errors={field.state.meta.errors}
                      options={question.questionsToOptions?.map(
                        (qto) => ({
                          id: qto.option.id,
                          text: qto.option.text ?? "",
                        })
                      )}
                      onBlur={field.handleBlur}
                      onChange={(value) =>
                        field.handleChange(value)
                      }
                    />
                  )}
                </form.Field>
                <form.Field name="text">
                  {(field) => (
                    <InnerField
                      label="extra toelichting"
                      value={field.state.value}
                      name={field.name}
                      errors={field.state.meta.errors}
                      question={question}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                  )}
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
                    <div
                      role="group"
                      aria-labelledby={`${name}-label`}
                      className="space-y-2"
                    >
                      <h2
                        id={`${field.name}-label`}
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-2xl"
                      >
                        {question.label}
                      </h2>
                      {question.questionsToOptions?.map(
                        (qto) => {
                          const optionChecked =
                            !!field.state.value.find(
                              (v) =>
                                v.value ===
                                qto.option.id.toString()
                            );
                          return (
                            <fieldset
                              key={qto.option.id}
                              className="space-y-2"
                            >
                              <legend className="sr-only">
                                {qto.option.text} (selecteer
                                en licht toe)
                              </legend>

                              <div className="flex items-center space-x-2 border border-input rounded-md p-4 relative">
                                <Checkbox
                                  aria-expanded={
                                    optionChecked
                                  }
                                  checked={optionChecked}
                                  onCheckedChange={(
                                    checked
                                  ) => {
                                    if (checked) {
                                      field.handleChange([
                                        ...field.state
                                          .value,
                                        {
                                          value:
                                            qto.option.id.toString(),
                                          explanation:
                                            field.state.value.find(
                                              (v) =>
                                                v.value ===
                                                qto.option.id.toString()
                                            )
                                              ?.explanation ??
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
                                  id={`${field.name}${qto.option.id}-check`}
                                />
                                <Label
                                  htmlFor={`${field.name}${qto.option.id}-check`}
                                  className="after:content-[''] after:absolute after:inset-0"
                                >
                                  {qto.option.text}
                                </Label>
                              </div>
                            </fieldset>
                          );
                        }
                      )}
                      {question.description && (
                        <p className="text-sm">
                          {question.description}
                        </p>
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
                    </div>
                  );
                }}
              </form.Field>
            );
          case "multiple_explained":
            return (
              <form.Field name="options" mode="array">
                {(field) => {
                  if (field.state?.value === undefined)
                    return null;

                  return (
                    <div
                      role="group"
                      aria-labelledby={`${name}-label`}
                      className="space-y-2"
                    >
                      <h2
                        id={`${field.name}-label`}
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-2xl"
                      >
                        {question.label}
                      </h2>
                      {question.questionsToOptions?.map(
                        (qto) => {
                          const optionChecked =
                            !!field.state.value.find(
                              (v) =>
                                v.value ===
                                qto.option.id.toString()
                            );
                          return (
                            <fieldset
                              key={qto.option.id}
                              className="space-y-2"
                            >
                              <legend className="sr-only">
                                {qto.option.text} (selecteer
                                en licht toe)
                              </legend>

                              <div className="flex items-center space-x-2 border border-input rounded-md p-4 relative">
                                <Checkbox
                                  aria-expanded={
                                    optionChecked
                                  }
                                  checked={optionChecked}
                                  onCheckedChange={(
                                    checked
                                  ) => {
                                    if (checked) {
                                      field.handleChange([
                                        ...field.state
                                          .value,
                                        {
                                          value:
                                            qto.option.id.toString(),
                                          explanation:
                                            field.state.value.find(
                                              (v) =>
                                                v.value ===
                                                qto.option.id.toString()
                                            )
                                              ?.explanation ??
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
                                  id={`${field.name}${qto.option.id}-check`}
                                />
                                <Label
                                  htmlFor={`${field.name}${qto.option.id}-check`}
                                  className="after:content-[''] after:absolute after:inset-0"
                                >
                                  {qto.option.text}
                                </Label>
                              </div>
                              {optionChecked && (
                                <div>
                                  <Label
                                    className="text-xl"
                                    htmlFor={`${field.name}${qto.option.id}-explanation`}
                                  >
                                    namelijk:
                                  </Label>
                                  <Input
                                    id={`${field.name}${qto.option.id}-explanation`}
                                    defaultValue={
                                      field.state.value.find(
                                        (v) =>
                                          v.value ===
                                          qto.option.id.toString()
                                      )?.explanation ?? ""
                                    }
                                    onBlur={
                                      field.handleBlur
                                    }
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
                            </fieldset>
                          );
                        }
                      )}
                      {question.description && (
                        <p className="text-sm">
                          {question.description}
                        </p>
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
                    </div>
                  );
                }}
              </form.Field>
            );
          case "score":
            return (
              <>
                <form.Field name="score">
                  {(field) => (
                    <InnerScoreField
                      label={question.label}
                      description={question.description}
                      lowText={
                        question.score_low_description ?? ""
                      }
                      highText={
                        question.score_high_description ??
                        ""
                      }
                      value={field.state.value}
                      name={field.name}
                      errors={field.state.meta.errors}
                      onChange={(value) =>
                        field.handleChange(value)
                      }
                    />
                  )}
                </form.Field>
                <form.Field name="text">
                  {(field) => (
                    <InnerField
                      label="extra toelichting"
                      value={field.state.value}
                      name={field.name}
                      errors={field.state.meta.errors}
                      question={question}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                  )}
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
            >
              {isSubmitting ? "..." : "Volgende"}
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={!canSubmit}
              onClick={() => {
                const submitDirection =
                  document.querySelector(
                    'input[name="direction"]'
                  ) as HTMLInputElement | null;
                if (submitDirection) {
                  submitDirection.value = "previous";
                }
              }}
            >
              {isSubmitting ? "..." : "Vorige"}
            </Button>
          </>
        )}
      </form.Subscribe>
      <input type="hidden" name="direction" value="next" />
      <input
        type="hidden"
        name="formId"
        value={formId}
      ></input>
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
