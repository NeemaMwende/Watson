import { cn } from "@/lib/utils";
import { FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
}

export default function MessageBubble({ role, content, timestamp, files }: MessageBubbleProps) {
  const isAssistant = role === "assistant";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={cn("flex gap-4 mb-6", !isAssistant && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        isAssistant ? "bg-blue-600" : "bg-slate-700"
      )}>
        {isAssistant ? (
          <span className="text-white text-lg">⚖️</span>
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-2 max-w-3xl", !isAssistant && "flex flex-col items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {isAssistant ? "Watson" : "You"}
          </span>
          <span className="text-xs text-slate-500">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Files if present */}
        {files && files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border",
                  isAssistant 
                    ? "bg-slate-50 border-slate-200" 
                    : "bg-blue-50 border-blue-200"
                )}
              >
                <FileText className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isAssistant ? "text-slate-600" : "text-blue-600"
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-600">{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Text */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isAssistant
              ? "bg-white border border-slate-200 text-slate-900"
              : "bg-blue-600 text-white"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}