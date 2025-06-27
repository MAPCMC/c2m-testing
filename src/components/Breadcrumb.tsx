import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import React from "react";

export function Breadcrumb({
  items,
}: {
  items: { title: string; href: string }[];
}) {
  return (
    <BreadcrumbComponent className="p-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              {items.length === index + 1 ? (
                <BreadcrumbPage>
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator
                key={index + "separator"}
              />
            )}
          </>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
