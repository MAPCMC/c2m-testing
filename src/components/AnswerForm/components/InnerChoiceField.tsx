import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import FieldDescription from "./FieldDescription";
import FieldLabel from "./FieldLabel";

interface InnerFieldProps {
  name: string;
  value: string;
  errors?: Array<
    string | { message: string } | null | undefined
  >;
  label: string;
  description?: string | null;
  as?: React.ElementType;
  wrapper?: React.ElementType;
  options: { id: number | string; text: string }[];
  onBlur?: () => void;
  onChange?: ((value: string) => void) | undefined;
  required?: boolean;
  [key: string]: unknown;
}

const InnerChoiceField = ({
  name,
  value,
  errors,
  label,
  description,
  wrapper,
  options,
  required,
  onBlur,
  onChange,
  ...props
}: InnerFieldProps) => {
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
        as="legend"
        id={`${name}-label`}
        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl"
        error={errors && errors.length > 0}
      >
        {label}
        {required && (
          <span className="text-destructive">
            * <span className="sr-only">verplicht</span>
          </span>
        )}
      </FieldLabel>
      <RadioGroup
        id={name}
        aria-labelledby={`${name}-label`}
        name={name}
        onBlur={onBlur}
        onValueChange={onChange}
        value={value}
        {...accessibleInputStateProps}
        {...props}
      >
        {options?.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-2 border border-input rounded-md p-4 relative"
          >
            <RadioGroupItem
              value={option.id.toString()}
              id={option.id.toString()}
            />
            <Label
              htmlFor={option.id.toString()}
              className="after:content-[''] after:absolute after:inset-0"
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
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

export default InnerChoiceField;
