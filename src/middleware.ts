export { default } from "next-auth/middleware";

// protect navigation to /admin
export const config = {
  matcher: [
    "/admin",
    "/admin/apps",
    "/admin/apps/:id",
    "/admin/apps/:id/edit",
    "/admin/apps/new",
    "/admin/code-create",
    "/admin/form-results",
    "/admin/form-results/:code",
    "/admin/forms",
    "/admin/forms/new",
    "/admin/forms/:id/edit",
    "/admin/forms/:id/chapter/new",
    "/admin/forms/:id/chapter/:chapterId",
    "/admin/forms/:id/chapter/:chapterId/edit",
    "/admin/forms/:id/chapter/:chapterId/question",
    "/admin/forms/:id/chapter/:chapterId/question/new",
    "/admin/forms/:id/chapter/:chapterId/question/:questionId/edit",
    "/admin/users",
    "/admin/users/:id/edit",
  ],
};
