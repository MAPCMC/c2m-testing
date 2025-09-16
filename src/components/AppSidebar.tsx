"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import C2MLogo from "./C2MLogo";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin";

  return (
    <Sidebar variant="sidebar" className="p-2">
      <SidebarHeader className="p-4">Menu</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin"}
                >
                  <Link href="/admin">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === "/admin/form-results" ||
                      pathname.startsWith(
                        "/admin/form-results/"
                      )
                    }
                  >
                    <Link href="/admin/form-results">
                      Resultaten
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === "/admin/code-create"
                  }
                >
                  <Link href="/admin/code-create">
                    Vragenlijsten klaarzetten
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Beheren</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === "/admin/forms" ||
                      pathname.startsWith("/admin/forms/")
                    }
                  >
                    <Link href="/admin/forms">
                      Vragenlijsten
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === "/admin/apps" ||
                      pathname.startsWith("/admin/apps/")
                    }
                  >
                    <Link href="/admin/apps">
                      Applicaties
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === "/admin/users" ||
                      pathname.startsWith("/admin/users/")
                    }
                  >
                    <Link href="/admin/users">
                      Gebruikers
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <C2MLogo className="w-20 md:w-24" />
      </SidebarFooter>
    </Sidebar>
  );
}
