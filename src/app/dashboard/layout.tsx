"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/barang", label: "Data Barang", icon: Package },
    { href: "/dashboard/stok", label: "Stok Barang", icon: ShoppingCart },
    { href: "/dashboard/pembelian", label: "Pembelian", icon: TrendingDown },
    { href: "/dashboard/penjualan", label: "Penjualan", icon: TrendingUp },
  ];

  if (isAdmin) {
    navItems.push({
      href: "/dashboard/users",
      label: "Manajemen User",
      icon: Users,
    });
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <span className="text-lg font-bold text-zinc-900">Warehouse App</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 md:hidden">
          <span className="text-lg font-bold text-zinc-900">Warehouse App</span>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
