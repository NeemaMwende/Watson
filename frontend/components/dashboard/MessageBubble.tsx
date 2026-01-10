import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Scale, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function MessageBubble({
  role,
  content,
  timestamp,
}: MessageBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-4 mb-6", !isAssistant && "flex-row-reverse")}>
      <Avatar
        className={cn(
          "h-10 w-10",
          isAssistant ? "bg-blue-600" : "bg-slate-700"
        )}
      >
        <AvatarFallback>
          {isAssistant ? (
            <Scale className="h-5 w-5 text-white" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex-1 space-y-2 max-w-3xl",
          !isAssistant && "flex flex-col items-end"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900">
            {isAssistant ? "Watson" : "You"}
          </span>
          <span className="text-xs text-slate-500">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isAssistant
              ? "bg-slate-100 text-slate-900"
              : "bg-blue-600 text-white"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
