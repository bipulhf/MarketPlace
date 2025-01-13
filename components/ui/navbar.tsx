"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "./button";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import CartIcon from "../CartIcon";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

export function Navbar() {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              StyleStore
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                {currentUser.role === 'buyer' && (
                  <Link href="/dashboard/orders">
                    <Button variant="ghost">My Orders</Button>
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            {currentUser ? (
              <>
                <span className="text-sm">Hello, {currentUser.name}</span>
                <CartIcon />
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <CartIcon />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {currentUser && (
                    <>
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                      </Link>
                      {currentUser.role === 'buyer' && (
                        <Link href="/dashboard/orders">
                          <Button variant="ghost" className="w-full justify-start">My Orders</Button>
                        </Link>
                      )}
                    </>
                  )}
                  <Link href="/search">
                    <Button variant="ghost" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </Link>
                  {currentUser ? (
                    <>
                      <span className="text-sm px-4">Hello, {currentUser.name}</span>
                      <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full">Sign up</Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}