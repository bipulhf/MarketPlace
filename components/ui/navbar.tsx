"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "./button";
import { ShoppingBag, User } from "lucide-react";
import CartIcon from "../CartIcon";

export function Navbar() {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              StyleStore
            </Link>
            {currentUser && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                {currentUser.role === 'buyer' && (
                  <Link href="/orders">
                    <Button variant="ghost">My Orders</Button>
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}