import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [chatId, setChatId] = useState<Id<"aiChats"> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getOrCreateChat = useMutation(api.ai.chat.getOrCreateChat);
  const sendMessage = useMutation(api.ai.chat.sendMessage);
  const saveAssistantMessage = useMutation(api.ai.chat.saveAssistantMessage);
  const clearChat = useMutation(api.ai.chat.clearChat);
  const generateResponse = useAction(api.ai.generate.generateResponse);

  const messages = useQuery(
    api.ai.chat.getMessages,
    chatId ? { chatId } : "skip"
  );

  // Initialize chat when panel opens
  useEffect(() => {
    if (open && !chatId) {
      getOrCreateChat().then(setChatId).catch(() => {
        toast.error("Failed to initialize chat");
      });
    }
  }, [open, chatId, getOrCreateChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  const handleSend = async () => {
    if (!input.trim() || !chatId || generating) return;

    const userMessage = input.trim();
    setInput("");
    setGenerating(true);

    try {
      await sendMessage({ chatId, content: userMessage });

      // Build message history for context
      const history: ChatMessage[] = [
        ...(messages ?? []).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userMessage },
      ];

      const response = await generateResponse({ messages: history });
      await saveAssistantMessage({ chatId, content: response.text });
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to get response"
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = async () => {
    if (!chatId) return;
    try {
      await clearChat({ chatId });
    } catch {
      toast.error("Failed to clear chat");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[540px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    Nexium AI
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Your AI assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {(!messages || messages.length === 0) && !generating && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    How can I help you?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ask me anything about building your project, design, or web
                    development.
                  </p>
                </div>
              )}

              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-foreground/5 text-foreground"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {generating && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-foreground/5 text-foreground flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Spinner className="w-3.5 h-3.5" />
                      <span className="text-xs text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-border shrink-0">
              <div className="flex items-end gap-2 bg-background rounded-xl border border-border p-1.5">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Nexium AI..."
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm px-2.5 py-2 max-h-24 placeholder:text-muted-foreground/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || generating}
                  className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
