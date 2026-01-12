"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import { Send, Paperclip, X, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface ChatInterfaceProps {
  chatId: string | null;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Watson, your AI legal assistant. I can help you with legal research, document analysis, contract review, and answering your legal questions. How may I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset chat when chatId changes
  // useEffect(() => {
  //   if (chatId) {
  //     setMessages([
  //       {
  //         id: "1",
  //         role: "assistant",
  //         content:
  //           "Hello! I'm Watson, your AI legal assistant. How may I assist you today?",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   }
  // }, [chatId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input || "Uploaded files for analysis",
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedFiles([]);
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: userMessage.files
          ? `I've received your ${userMessage.files.length} file(s). Once the backend is integrated, I'll analyze these documents and provide detailed legal insights. For now, this demonstrates the file upload functionality.`
          : "I understand your question. Once the backend is integrated with LangGraph and RAG, I'll provide comprehensive legal analysis based on your query and uploaded documents.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const isEmpty = messages.length === 1 && messages[0].role === "assistant";

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-3xl">⚖️</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                  How can I help you today?
                </h2>
                <p className="text-slate-600 max-w-md">
                  Ask me anything about law, upload documents for analysis, or
                  get help with legal research.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 w-full max-w-3xl">
                {[
                  {
                    title: "Contract Review",
                    description: "Analyze contracts and identify key clauses",
                    icon: "📄",
                  },
                  {
                    title: "Legal Research",
                    description: "Get answers to complex legal questions",
                    icon: "🔍",
                  },
                  {
                    title: "Document Analysis",
                    description: "Upload and review legal documents",
                    icon: "📊",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(item.description)}
                    className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  files={message.files}
                />
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white">⚖️</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                    <span className="text-sm text-slate-600">
                      Watson is analyzing...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Watson anything about law..."
                  className="min-h-[60px] max-h-[200px] resize-none pr-12 border-2 border-slate-200 focus:border-blue-400 rounded-2xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-2 bottom-2 h-8 w-8 text-slate-400 hover:text-blue-600"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={
                  (!input.trim() && uploadedFiles.length === 0) || isLoading
                }
                className="bg-blue-600 hover:bg-blue-700 h-[60px] px-6 rounded-2xl"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Press Enter to send, Shift + Enter for new line</span>
              {uploadedFiles.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {uploadedFiles.length} file
                  {uploadedFiles.length > 1 ? "s" : ""} attached
                </Badge>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
