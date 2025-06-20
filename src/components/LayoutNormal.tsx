import React from "react";

export default function LayoutNormal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-col flex items-center">
      {children}
    </div>
  );
}
