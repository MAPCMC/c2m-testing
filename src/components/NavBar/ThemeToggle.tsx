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

export function ThemeToggle({
  user,
}: {
  user?: UserWithProfile | false;
}) {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (user && user.theme) {
      setTheme(user.theme);
    }
  }, [user, setTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setProfileTheme(user, "light");
            setTheme("light");
          }}
        >
          Licht
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setProfileTheme(user, "dark");
            setTheme("dark");
          }}
        >
          Donker
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
