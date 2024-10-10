import { Input } from "@/components/ui/input";
import { ValidationError } from "@tanstack/react-form";

import FieldDescription from "./FieldDescription";
import FieldLabel from "./FieldLabel";

interface InnerFieldProps {
  name: string;
  value: string;
  errors: ValidationError[];
  label: string;
  description?: string | null;
  as?: React.ElementType;
  wrapper?: React.ElementType;
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
  onBlur,
  onChange,
  required,
  ...props
}: InnerFieldProps) => {
  const InputComponent = as ?? Input;
  const WrapperComponent = wrapper ?? "fieldset";

  if (value === undefined) return null;

  let accessibleInputStateProps: {
    [key: string]: string;
  } = {};

  if (description) {
    accessibleInputStateProps[
      "aria-describedby"
    ] = `${name}-description`;
  }

  if (errors.length > 0) {
    accessibleInputStateProps["aria-invalid"] = "true";

    errors.forEach((error, index) => {
      accessibleInputStateProps = {
        ...accessibleInputStateProps,
        "aria-describedby": `${
          accessibleInputStateProps["aria-describedby"] ??
          ""
        } ${name}-error-${index + 1}`,
      };
    });
  }

  return (
    <WrapperComponent className="space-y-2">
      <FieldLabel
        htmlFor={name}
        className="text-xl"
        error={errors.length > 0}
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
        aria-invalid={errors.length > 0}
        onBlur={onBlur}
        onChange={onChange}
        {...accessibleInputStateProps}
        {...props}
      />
      {description && (
        <FieldDescription name={name}>
          {description}
        </FieldDescription>
      )}
      {errors.map((error, index) => (
        <p
          key={error as string}
          id={`${name}-error-${index + 1}`}
          aria-live="assertive"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ))}
    </WrapperComponent>
  );
};

export default InnerField;
