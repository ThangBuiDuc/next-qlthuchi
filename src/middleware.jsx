import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req) {
    if (auth.userId && req.nextUrl.pathname === "/sign-in") {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    // if (
    //   auth.userId &&
    //   req.nextUrl.pathname === "/sign-in" &&
    //   req.nextUrl.searchParams.get("redirect_url")
    // ) {
    //   return NextResponse.redirect(
    //     req.nextUrl.searchParams.get("redirect_url")
    //   );
    // }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({
        returnBackUrl: req.url,
      });
      // const loginUrl = new URL("/sign-in", req.url);
      // loginUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      // return NextResponse.redirect(loginUrl);
    }
  },
  publicRoutes: [],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
