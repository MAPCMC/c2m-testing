"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function FormStopSessionButton({
  children,
  ...props
}: {
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    if (session?.user && !session?.user?.email) {
      // Perform sign-out for "form" session types only
      signOut({
        callbackUrl: "/",
      });
    } else {
      router.push("/");
    }
  };

  return (
    <Button {...props} onClick={handleSignOut}>
      {children ?? "Vragenlijst afsluiten"}
    </Button>
  );
}
