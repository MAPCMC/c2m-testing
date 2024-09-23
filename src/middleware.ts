export { default } from "next-auth/middleware";

// protect navigation to /admin
export const config = { matcher: "/admin" };
