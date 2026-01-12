"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully", {
        description: "See you next time!",
      });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (status === "loading") return null;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome back, {user?.name ?? "User"}
          </h1>
          <p className="text-sm text-slate-600">
            How can Watson assist you today?
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {initials}
                </span>
              </div>

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-600">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
