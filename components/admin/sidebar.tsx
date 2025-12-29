"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ShoppingCart,
  FolderTree,
  Settings,
  LogOut,
  ChevronLeft,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "商品管理",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "分类管理",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "卡密管理",
    href: "/admin/cards",
    icon: CreditCard,
  },
  {
    title: "订单管理",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 dark:border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-mono text-sm">
            LD
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-50">
            管理后台
          </span>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <Link href="/" target="_blank">
            <Button variant="outline" className="w-full gap-2 mb-2">
              <Store className="h-4 w-4" />
              访问前台
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full gap-2 text-zinc-600 hover:text-rose-600 dark:text-zinc-400"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </div>
      </div>
    </aside>
  );
}

// Mobile Sidebar using Sheet
export function AdminMobileHeader() {
  const pathname = usePathname();

  const currentPage = menuItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-mono text-white">
          LD
        </div>
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          {currentPage?.title || "管理后台"}
        </span>
      </div>

      {/* Mobile menu would be implemented with Sheet component */}
      <Link href="/" target="_blank">
        <Button variant="ghost" size="sm">
          <Store className="h-4 w-4" />
        </Button>
      </Link>
    </header>
  );
}

