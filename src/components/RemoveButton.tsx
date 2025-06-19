"use client";

import { Button } from "./ui/button";

export function RemoveButton({
  handleClick,
  ...props
}: React.PropsWithChildren<{
  handleClick: () => void;
  [key: string]: unknown;
}>) {
  return <Button onClick={handleClick} {...props} />;
}

export default RemoveButton;
