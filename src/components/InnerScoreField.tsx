import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import FieldDescription from "@/components/FieldDescription";
import FieldLabel from "@/components/FieldLabel";

interface InnerFieldProps {
  name: string;
  value: string;
  errors?: Array<
    string | { message: string } | null | undefined
  >;
  label: string;
  description?: string | null;
  lowText: string;
  highText: string;
  as?: React.ElementType;
  wrapper?: React.ElementType;
  onBlur?: () => void;
  onChange?: ((value: string) => void) | undefined;
  [key: string]: unknown;
}

const InnerScoreField = ({
  name,
  value,
  errors,
  label,
  description,
  lowText,
  highText,
  wrapper,
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
    <WrapperComponent className="space-y-2">
      <FieldLabel
        as="legend"
        id={`${name}-label`}
        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-2xl"
        error={errors && errors.length > 0}
      >
        {label}
      </FieldLabel>
      <RadioGroup
        id={name}
        name={name}
        onValueChange={onChange}
        value={value}
        className="flex flex-col md:grid md:grid-cols-5 gap-2"
        {...accessibleInputStateProps}
        {...props}
      >
        {["1", "2", "3", "4", "5", "nvt"].map(
          (scoreValue) => (
            <div
              key={scoreValue}
              className={cn(
                "flex md:flex-col items-center gap-3 relative",
                "border border-input rounded-md p-4",
                scoreValue === "nvt" ? " col-span-5" : ""
              )}
            >
              <RadioGroupItem
                value={scoreValue}
                id={scoreValue}
              />
              <Label
                htmlFor={scoreValue}
                className="after:w-full after:h-full after:absolute after:content-[''] after:inset-0"
                aria-describedby={
                  scoreValue === "1"
                    ? `${name}-low`
                    : scoreValue === "5"
                    ? `${name}-high`
                    : undefined
                }
              >
                {scoreValue === "nvt"
                  ? "geen mening"
                  : scoreValue}
              </Label>
              {scoreValue === "1" && (
                <p
                  className="text-sm text-center"
                  id={`${name}-low`}
                >
                  {lowText}
                </p>
              )}
              {scoreValue === "5" && (
                <p
                  className="text-sm text-center"
                  id={`${name}-high`}
                >
                  {highText}
                </p>
              )}
            </div>
          )
        )}
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

export default InnerScoreField;
