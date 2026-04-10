import { defineTable } from "convex/server";
import { v } from "convex/values";

export const aiChatsTable = defineTable({
  userId: v.id("users"),
  title: v.string(),
  lastMessageAt: v.string(),
}).index("by_user", ["userId"]);

export const aiChatMessagesTable = defineTable({
  chatId: v.id("aiChats"),
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
  sentAt: v.string(),
}).index("by_chat", ["chatId"]);
