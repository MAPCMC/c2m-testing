import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import { getUser } from "@/lib/getUser";

export type RequiredRole = "admin" | "superuser";

// Type for the wrapped component's props
type AuthenticatedPageProps<
  T extends Record<string, unknown> = Record<
    string,
    unknown
  >
> = {
  Component: React.ComponentType<T>;
  role: RequiredRole;
};

// Type for the returned component's props
type AuthenticatedComponentProps<
  T extends Record<string, unknown> = Record<
    string,
    unknown
  >
> = T;

export function AuthenticatedPage<
  T extends Record<string, unknown> = Record<
    string,
    unknown
  >
>(
  props: AuthenticatedPageProps<T>
): React.ComponentType<AuthenticatedComponentProps<T>> {
  const { Component, role } = props;

  const AuthenticatedComponent: React.ComponentType<
    AuthenticatedComponentProps<T>
  > = async (props) => {
    const user = await getUser();
    const session = await getServerSession(authOptions);

    if (session?.user && session.user.id === "anonymous") {
      redirect(`/${session.user.name}`);
    }

    if (
      !user ||
      !["admin", "superuser"].includes(user.role)
    ) {
      redirect("/");
    }

    if (user.role !== role) {
      redirect("/");
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}
