"use client";

export const findUserInfo = async (
  code: string,
  email?: string
) => {
  if (email) {
    return email;
  }

  try {
    const response = await fetch(
      `/api/user-name?code=${encodeURIComponent(code)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    const data = await response.json();
    return data.name || "anoniem";
  } catch (error) {
    console.error("Error fetching user info:", error);
    return "anoniem";
  }
};
