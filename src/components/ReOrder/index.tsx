"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { handleOrder } from "./action";
import { useRouter } from "next/navigation";

export default function ReOrder({
  order,
  id,
  schemaName,
}: {
  order?: number;
  id: number;
  schemaName: "form_chapters" | "questions";
}) {
  const router = useRouter();
  if (!id) {
    return null;
  }
  return (
    <div className="flex gap-2">
      <span className="min-h-full text-xl leading-none flex items-center">
        {order ?? "onbekend"}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={async () => {
          const result = await handleOrder({
            id: id,
            order: order ? order + 1 : 1,
            schemaName,
          });

          if (result === "ok") {
            router.refresh();
          }
        }}
      >
        <span className="sr-only">
          naar {order ? order + 1 : "achter"}
        </span>
        <Plus />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={async () => {
          const result = await handleOrder({
            id,
            order: order ? order - 1 : 1,
            schemaName,
          });
          if (result === "ok") {
            router.refresh();
          }
        }}
      >
        <span className="sr-only">
          naar {order ? order - 1 : "voor"}
        </span>
        <Minus />
      </Button>
    </div>
  );
}
