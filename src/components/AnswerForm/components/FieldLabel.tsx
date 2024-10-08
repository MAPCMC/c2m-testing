import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FieldLabel = ({
  className,
  error,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  error?: boolean;
}) => (
  <Label
    className={cn(error && "text-destructive", className)}
    {...props}
  />
);

export default FieldLabel;
