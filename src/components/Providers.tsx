"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import {
  ThemeProviderProps,
  ThemeProvider as NextThemesProvider,
} from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";

function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
