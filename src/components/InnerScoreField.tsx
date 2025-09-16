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
    <WrapperComponent className="space-y-3">
      <FieldLabel
        as="legend"
        id={`${name}-label`}
        className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl"
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
                "border border-border rounded-md p-4 bg-card",
                scoreValue === "nvt"
                  ? "md:col-span-3 md:col-start-2 text-center"
                  : ""
              )}
            >
              <RadioGroupItem
                value={scoreValue}
                id={scoreValue}
              />
              <Label
                htmlFor={scoreValue}
                className={cn(
                  "after:w-full after:h-full after:absolute after:content-[''] after:inset-0 leading-relaxed",
                  {
                    "text-4xl": scoreValue !== "nvt",
                  }
                )}
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
                  className="text-center leading-relaxed font-medium tracking-wide"
                  id={`${name}-low`}
                >
                  {lowText}
                </p>
              )}
              {scoreValue === "5" && (
                <p
                  className="text-center leading-relaxed font-medium tracking-wide"
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
