import React from "react";
import db from "@/db";
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

async function Users() {
  const users = await db.query.users.findMany();

  return (
    <LayoutAdmin headerTitle="Gebruikersbeheer">
      <h2 className="text-2xl font-medium">Gebruikers</h2>

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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.email}
              </TableCell>
              <TableCell>{user.role}</TableCell>
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
    </LayoutAdmin>
  );
}

export default AuthenticatedPage({
  Component: Users,
  role: "admin",
});
