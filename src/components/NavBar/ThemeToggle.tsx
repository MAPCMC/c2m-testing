"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserWithProfile } from "@/lib/getUser";
import { setProfileTheme } from "./actions/setProfileTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  user,
}: {
  user?: UserWithProfile | false;
}) {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    if (
      user &&
      theme &&
      user.theme &&
      user.theme !== theme
    ) {
      setTheme(user.theme);
    }
  }, [user, setTheme, theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Wissel van thema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="space-y-0.5"
      >
        <DropdownMenuItem
          className={cn(
            theme === "light" && "bg-c2m-aqua/20"
          )}
          onClick={async () => {
            setTheme("light");
            setProfileTheme(user, "light");
          }}
        >
          <Sun className="h-[1.5rem] w-[1.5rem] text-inherit" />
          Licht
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            theme === "dark" && "bg-c2m-aqua/20"
          )}
          onClick={async () => {
            setTheme("dark");
            setProfileTheme(user, "dark");
          }}
        >
          <Moon className="h-[1.2rem] w-[1.2rem] text-inherit" />
          Donker
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
