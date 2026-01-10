"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Scale, MessageSquare, History, Settings, LogOut } from "lucide-react";

export default function DashboardSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">Watson Legal</span>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
        >
          <MessageSquare className="mr-3 h-5 w-5" />
          New Chat
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <History className="mr-3 h-5 w-5" />
          Chat History
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </nav>

      <Separator className="bg-slate-700" />

      {/* User Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-slate-400 truncate">john@lawfirm.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-slate-800 hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
