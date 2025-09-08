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
import { Button } from "./ui/button";

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
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={item.href}>
                      {item.title}
                    </Link>
                  </Button>
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
