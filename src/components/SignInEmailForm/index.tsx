"use client";

import React from "react";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import formOpts from "./formOptions";
import { Button } from "../ui/button";
import InnerField from "../InnerField";
import checkUserResult from "./action";

import { signIn } from "next-auth/react";

export default function SignInEmailForm({
  code,
}: {
  code: string;
}) {
  const [formErrors, setFormErrors] = React.useState<
    string[]
  >([]);

  const form = useForm({
    ...formOpts(code),
    onSubmit: async ({ value }) => {
      const result = await checkUserResult(value);

      if (result) {
        setFormErrors([result]);
        return;
      } else {
        signIn("email", {
          email: value.email,
          callbackUrl: `/${code}`,
        });
        form.reset();
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-2"
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
      <form.Field
        name="email"
        validators={{
          onChange: z
            .string()
            .email("Dit is geen geldig e-mailadres"),
        }}
      >
        {(field) => (
          <InnerField
            label="E-mailadres"
            value={field.state.value}
            name={field.name}
            errors={
              field.state.meta.errors as {
                message: string;
              }[]
            }
            onBlur={field.handleBlur}
            onChange={(e) => {
              if (formErrors.length > 0) setFormErrors([]);
              field.handleChange(e.target.value);
            }}
          />
        )}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [
          formState.canSubmit,
          formState.isSubmitting,
        ]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || formErrors.length > 0}
          >
            {isSubmitting ? "..." : "Bevestigen"}
          </Button>
        )}
      </form.Subscribe>
      <form.Field name="code">
        {(field) => (
          <input
            type="hidden"
            name={field.name}
            value={code}
          ></input>
        )}
      </form.Field>
    </form>
  );
}
