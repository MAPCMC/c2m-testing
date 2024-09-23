"use client";

import {
  signIn,
  signOut,
  useSession,
} from "next-auth/react";

export default function SignIn() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <button onClick={() => signOut()}>Uitloggen</button>
    );
  }
  return (
    <button
      onClick={() => signIn("google")}
      disabled={status === "loading"}
    >
      Inloggen
    </button>
  );
}
