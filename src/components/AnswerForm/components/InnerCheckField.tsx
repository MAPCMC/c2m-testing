import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FieldDescription from "./FieldDescription";
import FieldLabel from "./FieldLabel";
import { Checkbox } from "@/components/ui/checkbox";

interface InnerFieldProps {
  name: string;
  value: boolean;
  errors?: Array<
    string | { message: string } | null | undefined
  >;
  label: string;
  description?: string | null;
  as?: React.ElementType;
  wrapper?: React.ElementType;
  onBlur?: () => void;
  onChange?: ((value: boolean) => void) | undefined;
  required?: boolean;
  className?: string;
  [key: string]: unknown;
}

const InnerCheckField = ({
  name,
  value,
  errors,
  label,
  description,
  wrapper,
  required,
  onBlur,
  onChange,
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
      <div className="flex items-center gap-2">
        <Checkbox
          id={name}
          aria-labelledby={`${name}-label`}
          name={name}
          onBlur={onBlur}
          onCheckedChange={onChange}
          checked={value}
          className={cn("peer border-border", className)}
          {...accessibleInputStateProps}
          {...props}
        />
        <FieldLabel
          htmlFor={name}
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
      </div>

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

export default InnerCheckField;
