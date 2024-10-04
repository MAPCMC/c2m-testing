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

  if (status === "authenticated") {
    return (
      <>
        {!noLogout && (
          <Button
            onClick={() => signOut()}
            disabled={noLogout}
          >
            Uitloggen
          </Button>
        )}
      </>
    );
  }
  return (
    <Button
      onClick={() => signIn("google")}
      disabled={status === "loading"}
    >
      {status === "loading" && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Inloggen
    </Button>
  );
}
