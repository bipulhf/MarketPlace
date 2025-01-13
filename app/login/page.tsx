"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { LogIn, Loader2, Store, ChevronLeft } from "lucide-react";
import { randomDelay } from "@/lib/delay";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await randomDelay(800, 1500);
      if (login(email, password)) {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
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
                Welcome back
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
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
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
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
                    onClick={() => router.push("/signup")}
                  >
                    Create an account
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