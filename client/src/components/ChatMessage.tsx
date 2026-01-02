import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "ai";
  text: string;
  timestamp?: string;
}

export function ChatMessage({ role, text, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl text-base shadow-md",
          "font-hindi leading-relaxed tracking-wide", // Ensure Hindi font is applied
          isUser
            ? "bg-gradient-to-br from-primary to-violet-600 text-white rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none border border-white/5"
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {timestamp && (
          <span className="text-[10px] opacity-50 mt-1 block text-right">
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
