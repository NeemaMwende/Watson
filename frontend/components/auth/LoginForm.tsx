"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scale, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await loginAction(formData);
    } catch (error) {
      toast.error("Authentication Failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to access your Watson Legal Assistant
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Server Action hooked here */}
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span>No account? </span>
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
