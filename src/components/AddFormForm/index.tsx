"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useTransform,
  useStore,
} from "@tanstack/react-form";
import formOpts from "./formOptions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { handleAddFormSubmit } from "./action";
import InnerField from "../AnswerForm/components/InnerField";
import { redirect } from "next/navigation";
import FieldLabel from "../AnswerForm/components/FieldLabel";

type Props = {
  apps: {
    id: string;
    name: string;
  }[];
};

export default function AddFormForm({ apps }: Props) {
  const stateRef = React.useRef(initialFormState);
  const [result, setResult] = React.useState<string | null>(
    null
  );
  const [state, action] = useActionState(
    handleAddFormSubmit,
    stateRef.current
  );

  React.useEffect(() => {
    if (state && state !== stateRef.current) {
      stateRef.current = state;
    }
  }, [state]);

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, stateRef.current),
      [stateRef.current]
    ),
    onSubmit: async () => {
      try {
        setResult("Vragenlijst aangemaakt.");

        form.reset();
      } catch (e) {
        console.error(e);
        setResult("Er is iets misgegaan.");
      }
    },
  });

  const formErrors = useStore(
    form.store,
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
      {formErrors.map((error, i) => (
        <p
          key={i}
          aria-live="assertive"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ))}
      <form.Field
        name="title"
        validators={{
          onSubmit: ({ value }) => {
            if (!value) return "Dit veld is verplicht";
            return null;
          },
        }}
      >
        {(field) => (
          <InnerField
            required
            label="Titel"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.handleChange(e.target.value)
            }
          />
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <InnerField
            label="Beschrijving"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.handleChange(e.target.value)
            }
          />
        )}
      </form.Field>

      <form.Field name="appId">
        {(field) => (
          <div>
            <FieldLabel>App</FieldLabel>
            <Select
              onValueChange={field.handleChange}
              defaultValue={field.state.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een app" />
              </SelectTrigger>
              <SelectContent>
                {apps
                  .filter((app) => !!app.name)
                  .map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => redirect("/forms")}
        >
          Annuleren
        </Button>
        <Button type="submit">Opslaan</Button>
      </div>
      {result && (
        <p
          aria-live="assertive"
          className="text-sm font-medium"
        >
          {result}
        </p>
      )}
    </form>
  );
}
