import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/config/auth";
import db from "@/db";

export async function GET(request: Request) {
  // Check if user is authenticated and has admin role
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized - Please log in" },
      { status: 401 }
    );
  }

  // Get user from database to check role
  const user = await db.query.users.findFirst({
    where: (u, { eq }) =>
      eq(u.id, session.user.id as string),
  });

  // Check if user has admin or superadmin role
  if (
    !user ||
    !["admin", "superadmin"].includes(user.role)
  ) {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Code parameter is required" },
      { status: 400 }
    );
  }

  try {
    const nameAnswer = await db.query.answers.findFirst({
      where: (a, { eq, and }) =>
        and(
          eq(a.code, code),
          eq(a.questionKey, "profile_name")
        ),
    });

    return NextResponse.json({
      name: nameAnswer?.text || "anoniem",
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
