"use client";

import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AdminTabsProps {
  tabs: {
    title: string;
    href: string;
    active?: boolean;
  }[];
}

export function AdminTabs({ tabs }: AdminTabsProps) {
  const router = useRouter();
  const activeTab =
    tabs.find((tab) => tab.active)?.href || tabs[0]?.href;

  if (!tabs.length) return null;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        router.push(value);
      }}
      className="px-4"
    >
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.href} value={tab.href}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
