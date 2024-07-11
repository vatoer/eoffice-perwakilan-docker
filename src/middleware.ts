// middleware.ts
import {
  DEFAULT_ROUTE_AFTER_LOGIN,
  apiAuthPrefix,
  authRoutes,
  getAllowedRoutes,
  publicRoutes,
} from "@/routes";
import { auth } from "@auth/auth";
import { NextResponse } from "next/server";

export const middleware = auth(async (req) => {
  try {
    const { nextUrl } = req;
    const session = req.auth;
    const isLoggenIn = !!session;

    console.log("[MIDDLEWARE] user: ", session?.user?.name);
    console.log("[MIDDLEWARE] trying access to:", nextUrl.pathname);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

    // check if the route is a public route or sub route
    const isPublicRoute =
      publicRoutes.includes(nextUrl.pathname) ||
      publicRoutes.some(
        (route) => nextUrl.pathname.startsWith(route) && route !== "/"
      );

    if (isPublicRoute) {
      return;
    }

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // if the route is an Auth route, we don't need to redirect
    if (isApiAuthRoute) {
      return;
    }

    // if the route is an Auth route and is log in, redirect to the default route
    if (isAuthRoute) {
      if (isLoggenIn) {
        return Response.redirect(new URL(DEFAULT_ROUTE_AFTER_LOGIN, nextUrl));
      }
      return;
    }

    // if the route is not a public route and not log in, redirect to the sign in page
    if (!isLoggenIn && !isPublicRoute) {
      return Response.redirect(new URL("/signin", nextUrl));
    }

    // if log in check permission here
    const myClearance = session?.user?.permissions;

    // if no permissions found, redirect to sign in page
    if (!myClearance) {
      console.error("[MIDDLEWARE] No permissions found");
      // Optionally, handle no permissions found (e.g., log out user, redirect to error page)
      const response = NextResponse.redirect(new URL("/signin", nextUrl));
      response.cookies.set("authjs.session-token", "", { maxAge: 0 });
      response.cookies.set("__Secure-authjs.session-token", "", { maxAge: 0 });
      return response;
    }

    // Ensure myClearance is an array
    if (myClearance && !Array.isArray(myClearance)) {
      console.error("[MIDDLEWARE] Invalid permissions format:", myClearance);
      // Optionally, handle invalid permissions format (e.g., log out user, redirect to error page)
      const response = NextResponse.redirect(new URL("/error", nextUrl));
      response.cookies.set("authjs.session-token", "", { maxAge: 0 });
      response.cookies.set("__Secure-authjs.session-token", "", { maxAge: 0 });
      return response;
    }

    if (myClearance) {
      try {
        const allowedRoutes = await getAllowedRoutes(myClearance);

        // check if the route is allowed
        // check if route is cascade permission
        const isRouteAllowed = allowedRoutes.some((route) => {
          // Direct match
          if (route.href === nextUrl.pathname) {
            return true;
          }

          // Check for cascade permissions
          if (route.cascadePermissions) {
            return nextUrl.pathname.startsWith(route.href);
          }
        });

        if (!isRouteAllowed) {
          return Response.redirect(new URL(DEFAULT_ROUTE_AFTER_LOGIN, nextUrl));
        }
      } catch (err) {
        console.error("[MIDDLEWARE] Error checking permissions:", err);
        // Handle permission check errors, maybe redirect to an error page or log out the user
        return Response.redirect(new URL("/signin", nextUrl));
      }
    }
  } catch (err) {
    console.error("[MIDDLEWARE] Unexpected error:", err);
    // Handle unexpected errors, maybe redirect to an error page or log out the user
    const response = NextResponse.redirect(new URL("/signin", req.url));
    response.cookies.set("authjs.session-token", "", { maxAge: 0 });
    response.cookies.set("__Secure-authjs.session-token", "", { maxAge: 0 });
    return response;
  }
  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default middleware;
