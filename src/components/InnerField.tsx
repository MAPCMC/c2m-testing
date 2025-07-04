import { Input } from "@/components/ui/input";
import FieldDescription from "@/components/FieldDescription";
import FieldLabel from "@/components/FieldLabel";
import { cn } from "@/lib/utils";
import React from "react";

interface InnerFieldProps {
  name: string;
  value: string;
  errors?: Array<
    string | { message: string } | null | undefined
  >;
  label: string;
  description?: string | null;
  className?: string;
  as?: React.ElementType;
  wrapper?: React.ElementType;
  wrapperClassName?: string;
  required?: boolean;
  onBlur?: () => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  [key: string]: unknown;
}

const InnerField = ({
  name,
  value,
  errors,
  label,
  description,
  as,
  wrapper,
  wrapperClassName,
  onBlur,
  onChange,
  required,
  className,
  ...props
}: InnerFieldProps) => {
  const InputComponent = as ?? Input;
  const WrapperComponent = wrapper ?? "fieldset";

  if (value === undefined) return null;

  const accessibleInputStateProps: {
    [key: string]: string;
  } = {};

  if (description) {
    accessibleInputStateProps[
      "aria-describedby"
    ] = `${name}-description`;
  }

  if (errors && errors.length > 0) {
    accessibleInputStateProps["aria-invalid"] = "true";
    accessibleInputStateProps["aria-describedby"] = errors
      .filter(
        (error) => error !== undefined && error !== null
      )
      .reduce(
        (acc: string, _, index) =>
          `${acc}${name}-error-${index + 1}${
            index < errors.length - 1 ? " " : ""
          }`,
        ""
      );
  }

  return (
    <WrapperComponent
      className={cn("space-y-2", wrapperClassName)}
    >
      <FieldLabel
        htmlFor={name}
        className={"text-xl"}
        error={errors && errors.length > 0}
      >
        {label}{" "}
        {required && (
          <span className="text-destructive">
            * <span className="sr-only">verplicht</span>
          </span>
        )}
      </FieldLabel>
      <InputComponent
        id={name}
        name={name}
        value={value}
        aria-invalid={errors && errors.length > 0}
        onBlur={onBlur}
        onChange={onChange}
        className={cn("bg-input border-border", className)}
        {...accessibleInputStateProps}
        {...props}
      />
      {description && (
        <FieldDescription name={name}>
          {description}
        </FieldDescription>
      )}
      {errors
        ?.filter(
          (error) => error !== undefined && error !== null
        )
        .map((error, index) => (
          <p
            key={
              typeof error === "string"
                ? error
                : error.message
            }
            id={`${name}-error-${index + 1}`}
            aria-live="assertive"
            className="text-sm font-medium text-destructive"
          >
            {typeof error === "string"
              ? error
              : error.message}
          </p>
        ))}
    </WrapperComponent>
  );
};

export default InnerField;
