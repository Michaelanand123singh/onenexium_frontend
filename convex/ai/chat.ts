import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getOrCreateChat = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "User not logged in" });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    }

    // Find existing chat for this user
    const existingChat = await ctx.db
      .query("aiChats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (existingChat) {
      return existingChat._id;
    }

    // Create new chat
    const chatId = await ctx.db.insert("aiChats", {
      userId: user._id,
      title: "AI Assistant",
      lastMessageAt: new Date().toISOString(),
    });

    return chatId;
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("aiChats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "User not logged in" });
    }

    await ctx.db.insert("aiChatMessages", {
      chatId: args.chatId,
      role: "user",
      content: args.content,
      sentAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.chatId, {
      lastMessageAt: new Date().toISOString(),
    });

    return args.chatId;
  },
});

export const saveAssistantMessage = mutation({
  args: {
    chatId: v.id("aiChats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiChatMessages", {
      chatId: args.chatId,
      role: "assistant",
      content: args.content,
      sentAt: new Date().toISOString(),
    });
  },
});

export const getMessages = query({
  args: { chatId: v.id("aiChats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "User not logged in" });
    }

    return await ctx.db
      .query("aiChatMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});

export const clearChat = mutation({
  args: { chatId: v.id("aiChats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "User not logged in" });
    }

    const messages = await ctx.db
      .query("aiChatMessages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
