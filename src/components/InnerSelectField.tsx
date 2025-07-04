import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FieldDescription from "@/components/FieldDescription";
import FieldLabel from "@/components/FieldLabel";
import { cn } from "@/lib/utils";

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
  wrapperClassName?: string;
  className?: string;
  options: { id: number | string; text: string }[];
  onBlur?: () => void;
  onChange?: ((value: string) => void) | undefined;
  required?: boolean;
  [key: string]: unknown;
}

const InnerSelectField = ({
  name,
  value,
  errors,
  label,
  description,
  wrapper,
  wrapperClassName,
  className,
  options,
  required,
  onBlur,
  onChange,
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
    <WrapperComponent
      className={cn("space-y-2", wrapperClassName)}
    >
      <FieldLabel
        as="legend"
        id={`${name}-label`}
        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl"
        error={errors && errors.length > 0}
      >
        {label}{" "}
        {required && (
          <span className="text-destructive">
            * <span className="sr-only">verplicht</span>
          </span>
        )}
      </FieldLabel>
      <Select
        aria-labelledby={`${name}-label`}
        name={name}
        onValueChange={(value) => {
          onChange?.(value);
          onBlur?.();
        }}
        value={value}
        {...props}
      >
        <SelectTrigger
          className="border-border bg-input"
          {...accessibleInputStateProps}
        >
          <SelectValue placeholder="Maak een keuze" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_none" className="hidden">
            Geen keuze
          </SelectItem>
          {options?.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id.toString()}
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

export default InnerSelectField;
