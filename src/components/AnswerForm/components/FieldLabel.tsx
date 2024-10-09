import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FieldLabel = ({
  className,
  error,
  as,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  error?: boolean;
  as?: React.ElementType;
}) => {
  const Comp = as ?? Label;

  return (
    <Comp
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  );
};

export default FieldLabel;
