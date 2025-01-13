"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { UserPlus, Loader2, Store, ChevronLeft } from "lucide-react";
import { randomDelay } from "@/lib/delay";
import { motion } from "framer-motion";
import { UserRole } from "@/lib/types";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(searchParams.get("type") || "buyer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const addUser = useStore((state) => state.addUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await randomDelay(800, 1500);
      const success = addUser({
        name,
        email,
        password,
        role: userType as UserRole,
      });

      if (success) {
        router.push("/login");
      } else {
        setError("Email already exists");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="text-muted-foreground mt-2">
                Join our marketplace and start your journey
              </p>
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-destructive/10 text-destructive text-center text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                      minLength={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Account Type
                    </label>
                    <Select
                      value={userType}
                      onValueChange={setUserType}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create account
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    onClick={() => router.push("/login")}
                  >
                    Sign in to existing account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}