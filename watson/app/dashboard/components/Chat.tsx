"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  relevanceScores?: number[];
  usedWebSearch?: boolean;
  timestamp: Date;
}

export default function Chat({ sessionId }: { sessionId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      loadSessionMessages(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const loadSessionMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(
          data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.createdAt),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        relevanceScores: data.relevanceScores,
        usedWebSearch: data.usedWebSearch,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Legal Research Assistant
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Powered by AI • Indian Law Specialist
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to Watson
              </h2>
              <p className="text-white/60 text-lg mb-8">
                Your AI-powered legal research assistant. Ask me anything about
                Indian law, case precedents, or legal concepts.
              </p>

              {/* Example Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                <ExamplePrompt
                  icon={<FileText className="w-5 h-5" />}
                  text="Explain Section 420 of IPC"
                  onClick={() => setInput("Explain Section 420 of IPC")}
                />
                <ExamplePrompt
                  icon={<Globe className="w-5 h-5" />}
                  text="Recent Supreme Court judgments on privacy"
                  onClick={() =>
                    setInput("Recent Supreme Court judgments on privacy")
                  }
                />
                <ExamplePrompt
                  icon={<FileText className="w-5 h-5" />}
                  text="Difference between bail and anticipatory bail"
                  onClick={() =>
                    setInput("Difference between bail and anticipatory bail")
                  }
                />
                <ExamplePrompt
                  icon={<Globe className="w-5 h-5" />}
                  text="Consumer protection laws in India"
                  onClick={() => setInput("Consumer protection laws in India")}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                    <span className="text-white/70">Watson is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-t border-white/10 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask a legal question... (Press Enter to send, Shift+Enter for new line)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                rows={1}
                disabled={isLoading}
                style={{ maxHeight: "200px" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex-shrink-0"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              AI can make mistakes. Verify important information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplePrompt({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 rounded-xl p-4 text-left transition-all hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-400 group-hover:text-purple-300">
          {icon}
        </div>
        <p className="text-white/70 group-hover:text-white text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </button>
  );
}
