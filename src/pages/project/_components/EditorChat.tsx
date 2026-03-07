import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowUp,
  Loader2,
  Plus,
  Bot,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Id, Doc } from "@/convex/_generated/dataModel.d.ts";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

type Message = Doc<"projectMessages">;

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const timeAgo = formatDistanceToNow(new Date(message.sentAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
          isUser
            ? "bg-[#0C0F18]/5 text-[#0C0F18]/50"
            : "text-white"
        }`}
        style={!isUser ? { background: BRAND_GRADIENT } : undefined}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Message */}
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
          isUser
            ? "bg-[#3D4EF0]/10 text-[#0C0F18]/70 rounded-tr-sm"
            : "bg-[#F9FAFB] text-[#0C0F18]/60 rounded-tl-sm border border-[#0C0F18]/5"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? "text-[#0C0F18]/25 text-right" : "text-[#0C0F18]/20"
          }`}
        >
          {timeAgo}
        </p>
      </div>
    </motion.div>
  );
}

const QUICK_ACTIONS = [
  "Add a contact form",
  "Change the color scheme",
  "Add a pricing section",
  "Make it more modern",
];

export default function EditorChat({
  projectId,
  projectName,
}: {
  projectId: Id<"projects">;
  projectName: string;
}) {
  const messages = useQuery(api.projectMessages.list, { projectId });
  const sendMessage = useMutation(api.projectMessages.send);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages?.length]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isSending) return;

    setInput("");
    setIsSending(true);
    try {
      await sendMessage({ projectId, content });
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to send message");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="w-[380px] shrink-0 border-r border-[#0C0F18]/5 bg-white flex flex-col">
      {/* Chat header */}
      <div className="h-11 shrink-0 border-b border-[#0C0F18]/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-white"
            style={{ background: BRAND_GRADIENT }}
          >
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-[#0C0F18]/50">
            AI Chat
          </span>
        </div>
        <button
          onClick={() => toast.info("Coming soon in a future milestone!")}
          className="w-6 h-6 rounded flex items-center justify-center text-[#0C0F18]/20 hover:text-[#0C0F18]/50 hover:bg-[#0C0F18]/5 transition-colors cursor-pointer"
          title="New chat"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
              style={{ background: BRAND_GRADIENT }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#0C0F18]/60 mb-1">
              Start building
            </h3>
            <p className="text-xs text-[#0C0F18]/30 max-w-[220px] leading-relaxed mb-6">
              Tell me what changes you want to make to{" "}
              <span className="text-[#0C0F18]/50 font-medium">{projectName}</span>
            </p>

            {/* Quick action pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#0C0F18]/35 bg-[#0C0F18]/[0.02] border border-[#0C0F18]/5 hover:bg-[#3D4EF0]/5 hover:border-[#3D4EF0]/15 hover:text-[#3D4EF0] transition-all cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages?.map((msg) => (
            <ChatBubble key={msg._id} message={msg} />
          ))}
        </AnimatePresence>

        {isSending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-[#3D4EF0]/60"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-[#0C0F18]/5 p-3">
        <div className="relative bg-[#0C0F18]/[0.02] border border-[#0C0F18]/8 rounded-xl overflow-hidden focus-within:border-[#3D4EF0]/30 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to change..."
            rows={2}
            disabled={isSending}
            className="w-full resize-none bg-transparent text-[#0C0F18]/70 text-[13px] leading-relaxed placeholder:text-[#0C0F18]/20 outline-none p-3 pr-12 disabled:opacity-40"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className="absolute right-2.5 bottom-2.5 w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-20 cursor-pointer hover:shadow-md hover:shadow-[#3D4EF0]/20"
            style={{ background: BRAND_GRADIENT }}
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-[#0C0F18]/20 text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
