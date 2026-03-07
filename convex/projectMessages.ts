import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    // Verify project ownership
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user || project.userId !== user._id) {
      return [];
    }

    return await ctx.db
      .query("projectMessages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user || project.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission",
      });
    }

    const now = new Date().toISOString();

    // Save user message
    await ctx.db.insert("projectMessages", {
      projectId: args.projectId,
      role: "user",
      content: args.content.trim(),
      sentAt: now,
    });

    // Generate a simulated assistant response
    const responses = [
      `Got it! I'm updating your project based on: "${args.content.trim().slice(0, 50)}..."`,
      "I've made the changes. The preview has been updated on the right. Let me know if you'd like any adjustments!",
      "Done! I've applied your changes. Take a look at the preview and tell me what you think.",
      "Changes applied successfully. The layout and content have been updated to match your request.",
      "I've redesigned that section for you. Check the preview to see the new look!",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];

    await ctx.db.insert("projectMessages", {
      projectId: args.projectId,
      role: "assistant",
      content: response,
      sentAt: new Date(Date.now() + 1500).toISOString(),
    });

    // Update project lastEditedAt
    await ctx.db.patch(args.projectId, {
      lastEditedAt: now,
    });

    return { success: true };
  },
});
