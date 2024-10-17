"use client";

import React from "react";
import {
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignIn({
  noLogout,
}: {
  noLogout?: boolean;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Button disabled variant="outline" size="icon">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }
  if (status === "authenticated") {
    return (
      <>
        {!noLogout && (
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            disabled={noLogout}
          >
            Uitloggen
          </Button>
        )}
      </>
    );
  }
  return (
    <Button onClick={() => signIn("google")}>
      Inloggen
    </Button>
  );
}
