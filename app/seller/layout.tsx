"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Package,
  Settings,
  Store,
  Users,
  PlusCircle,
  LogOut,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/seller/dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: "Products",
    href: "/seller/products",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "Orders",
    href: "/seller/orders",
    icon: <Store className="w-5 h-5" />,
  },
  {
    title: "Customers",
    href: "/seller/customers",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/seller/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col bg-card border-r transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-72"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            Seller Dashboard
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2">
            <Button
              asChild
              variant="default"
              className="w-full justify-start gap-2"
            >
              <Link href="/seller/products/new">
                <PlusCircle className="w-5 h-5" />
                Add New Product
              </Link>
            </Button>
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href &&
                    "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex-1 flex gap-4 items-center">
              <div className="relative w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-8"
                />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
