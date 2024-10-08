import React from "react";
import { cn } from "@/lib/utils";

const FieldDescription = ({
  className,
  name,
  ...props
}: React.LabelHTMLAttributes<HTMLParagraphElement> & {
  name: string;
}) => (
  <p
    id={`${name}-description`}
    className={cn(
      "text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
);

export default FieldDescription;
