import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user as { role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  // 保护 /admin 路由（登录页除外）
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.auth || !isAdmin) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 已登录的管理员访问登录页时重定向到后台首页
  if (pathname === "/admin/login" && req.auth && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};

