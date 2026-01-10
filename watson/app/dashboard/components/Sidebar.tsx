"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Plus,
  MessageSquare,
  LogOut,
  Scale,
  User,
  Settings,
  Trash2,
} from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export default function Sidebar({
  currentSessionId,
  onSessionChange,
}: {
  currentSessionId: string | null;
  onSessionChange: (id: string | null) => void;
}) {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const createNewSession = () => {
    onSessionChange(null);
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this chat?")) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          onSessionChange(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  return (
    <div className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Watson</span>
        </div>

        <button
          onClick={createNewSession}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-white/40 text-xs uppercase font-semibold px-3 mb-2">
          Recent Chats
        </h3>
        {sessions.length === 0 ? (
          <p className="text-white/40 text-sm px-3 py-8 text-center">
            No chats yet
          </p>
        ) : (
          sessions.map((chatSession) => (
            <button
              key={chatSession.id}
              onClick={() => onSessionChange(chatSession.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all group relative ${
                currentSessionId === chatSession.id
                  ? "bg-purple-500/20 border border-purple-500/30 text-white"
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{chatSession.title}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(chatSession.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteSession(chatSession.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-2">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-white/40 text-xs truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex-1 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
