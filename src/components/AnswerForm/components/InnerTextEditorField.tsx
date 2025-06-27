import FieldDescription from "./FieldDescription";
import FieldLabel from "./FieldLabel";
import React from "react";
import TextEditor from "./TextEditor";

interface InnerFieldProps {
  name: string;
  value: string;
  errors?: Array<
    string | { message: string } | null | undefined
  >;
  label: string;
  description?: string | null;
  className?: string;
  wrapper?: React.ElementType;
  required?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  [key: string]: unknown;
}

const InnerTextEditorField = ({
  name,
  value,
  errors,
  label,
  description,
  wrapper,
  onBlur,
  onChange,
  required,
  className,
  ...props
}: InnerFieldProps) => {
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
    <WrapperComponent className="space-y-2">
      <FieldLabel
        htmlFor={name}
        className="text-xl"
        error={errors && errors.length > 0}
      >
        {label}{" "}
        {required && (
          <span className="text-destructive">
            * <span className="sr-only">verplicht</span>
          </span>
        )}
      </FieldLabel>
      <TextEditor
        id={name}
        name={name}
        value={value}
        aria-invalid={errors && errors.length > 0}
        onBlur={onBlur}
        onChange={onChange}
        className={className}
        {...accessibleInputStateProps}
        {...props}
      />
      <input type="hidden" name={name} value={value} />
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

export default InnerTextEditorField;
