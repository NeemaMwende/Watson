"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Scale,
  MessageSquare,
  Plus,
  FileText,
  Trash2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onToggle,
  currentChatId,
  onChatSelect,
  onNewChat,
}: DashboardSidebarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"chats" | "files">("chats");

  const { data: session } = useSession();
  const user = session?.user;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const [chats] = useState<Chat[]>(() => {
    const now = Date.now();

    return [
      {
        id: "1",
        title: "Contract Review Question",
        lastMessage: "What are the key clauses...",
        timestamp: new Date(now - 1000 * 60 * 30),
      },
      {
        id: "2",
        title: "Employment Law Query",
        lastMessage: "Can you explain the difference...",
        timestamp: new Date(now - 1000 * 60 * 60 * 2),
      },
      {
        id: "3",
        title: "Intellectual Property Rights",
        lastMessage: "How do I protect my trademark...",
        timestamp: new Date(now - 1000 * 60 * 60 * 24),
      },
    ];
  });

  const [files] = useState([
    {
      id: "1",
      name: "Employment_Contract.pdf",
      size: "2.4 MB",
      uploadedAt: new Date(),
    },
    {
      id: "2",
      name: "NDA_Template.docx",
      size: "1.1 MB",
      uploadedAt: new Date(),
    },
  ]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully", {
        description: "See you next time!",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (!isOpen) {
    return (
      <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold text-white">Watson</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator className="bg-slate-800" />

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "chats"
              ? "text-white border-b-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="inline-block mr-2 h-4 w-4" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "files"
              ? "text-white border-b-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="inline-block mr-2 h-4 w-4" />
          Files
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {activeTab === "chats" ? (
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`group flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {formatTimestamp(chat.timestamp)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-white"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-slate-800 border-slate-700"
                  >
                    <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="group flex items-start justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{file.size}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Separator className="bg-slate-800" />

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-slate-800 ml-2"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
