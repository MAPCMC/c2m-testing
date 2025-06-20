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
    if (user && user.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [user, setTheme, theme]);

  React.useEffect(() => {
    if (user && theme && theme !== user.theme) {
      setProfileTheme(user, theme as "light" | "dark");
    }
  }, [theme, user, setProfileTheme]);

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
          className={cn(
            theme === "light" &&
              "bg-accent text-accent-foreground"
          )}
          onClick={async () => {
            setTheme("light");
          }}
        >
          Licht
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            theme === "dark" &&
              "bg-accent text-accent-foreground"
          )}
          onClick={async () => {
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
