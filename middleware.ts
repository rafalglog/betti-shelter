import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authProviderConfigList } from './auth.config';

const { auth } = NextAuth(authProviderConfigList)
export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (!session?.user) {
    return
  }

  const allowlist = [
    "/dashboard/settings",
    "/sign-in",
    "/forgot-password",
    "/reset-password",
  ]

  const isAllowedPath = allowlist.some((path) => pathname.startsWith(path))

  if (session.user.mustChangePassword && !isAllowedPath) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard/settings"
    url.searchParams.set("force", "1")
    return NextResponse.redirect(url)
  }
})

// Filter Middleware to avoid API routes and static assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
