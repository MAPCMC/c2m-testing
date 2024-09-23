"use client";

import {
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const { data, status } = useSession();

  if (status === "authenticated") {
    return (
      <>
        <span className="mr-3">{data.user?.email}</span>
        <Button onClick={() => signOut()}>Uitloggen</Button>
      </>
    );
  }
  return (
    <Button
      onClick={() => signIn("google")}
      disabled={status === "loading"}
    >
      Inloggen
    </Button>
  );
}
