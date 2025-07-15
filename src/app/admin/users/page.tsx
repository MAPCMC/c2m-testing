import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";
import LayoutAdmin from "@/components/LayoutAdmin";
import Search from "@/components/Search";
import { getUsers } from "@/lib/getUsers";
interface Props {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

async function Users(props: Props) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const currentPage = searchParams?.page || "1";

  const limit = 20;
  const page = parseInt(currentPage, 10);
  const offset = (page - 1) * limit;

  const users = await getUsers({
    q: query,
    limit,
    page,
  });
  const hasNext = offset + limit < users.total;

  const setRoleString = (role: string) => {
    switch (role) {
      case "superuser":
        return "Hoofdgebruiker";
      case "admin":
        return "Beheerder";
      case "user":
        return "Gebruiker";
    }
  };
  return (
    <LayoutAdmin headerTitle="Gebruikersbeheer">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-medium">Gebruikers</h2>
        <Search placeholder="Zoeken op e-mail..." />
      </div>
      <Table className="w-full">
        <TableCaption>
          Een lijst van alle gebruikers
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">
              E-mailadres
            </TableHead>
            <TableHead className="font-bold">Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.result.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.email}
              </TableCell>
              <TableCell>
                {setRoleString(user.role)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                    >
                      Bewerken
                      <span className="sr-only">
                        {user.email}
                      </span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex gap-4 justify-between">
        {page > 1 ? (
          <Button asChild variant="outline">
            <Link href={`?q=${query}&page=${page - 1}`}>
              Vorige
            </Link>
          </Button>
        ) : (
          <Button disabled variant="outline">
            Vorige
          </Button>
        )}

        {hasNext ? (
          <Button asChild>
            <Link href={`?q=${query}&page=${page + 1}`}>
              Volgende
            </Link>
          </Button>
        ) : (
          <Button disabled>Volgende</Button>
        )}
      </div>
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: Users,
  role: "admin",
});
