export { auth as middleware } from "./app/actions/auth";

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};
