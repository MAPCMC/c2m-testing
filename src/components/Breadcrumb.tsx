import React from "react";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function Breadcrumb({
  items,
}: {
  items: { title: string; href: string }[];
}) {
  return (
    <BreadcrumbComponent className="p-2">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {items.length === index + 1 ? (
                <BreadcrumbPage className="py-2">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className="p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    {item.title}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator
                key={index + "separator"}
              />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
