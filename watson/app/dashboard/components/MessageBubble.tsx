"use client";

import {
  User,
  Sparkles,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  relevanceScores?: number[];
  usedWebSearch?: boolean;
  timestamp: Date;
}

export default function MessageBubble({ message }: { message: Message }) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`flex gap-4 max-w-4xl ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-purple-500/20 animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <div
            className={`rounded-2xl px-6 py-4 ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-white/10 backdrop-blur-sm text-white border border-white/10 shadow-lg"
            }`}
          >
            {/* Message Text */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>

            {/* Metadata for Assistant Messages */}
            {!isUser && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs">
                {message.usedWebSearch && (
                  <div className="flex items-center gap-1.5 text-green-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Web search used</span>
                  </div>
                )}
                {message.sources && message.sources.length > 0 && (
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{message.sources.length} sources</span>
                  </div>
                )}
                <div className="text-white/40 ml-auto">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sources Section */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                {showSources ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>
                  {showSources ? "Hide" : "Show"} {message.sources.length}{" "}
                  source
                  {message.sources.length !== 1 ? "s" : ""}
                </span>
              </button>

              {showSources && (
                <div className="mt-3 space-y-2">
                  {message.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-purple-400">
                          Source {idx + 1}
                        </span>
                        {message.relevanceScores &&
                          message.relevanceScores[idx] && (
                            <span className="text-xs text-white/60">
                              Relevance:{" "}
                              {message.relevanceScores[idx].toFixed(1)}/10
                            </span>
                          )}
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                        {source}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timestamp for User Messages */}
          {isUser && (
            <div className="text-xs text-white/40 mt-2 text-right">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
