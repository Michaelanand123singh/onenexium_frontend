import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    prompt: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const projectId = await ctx.db.insert("projects", {
      userId: user._id,
      name: args.name,
      description: args.description,
      prompt: args.prompt,
      status: "active",
      visibility: args.visibility,
      lastEditedAt: new Date().toISOString(),
    });

    return projectId;
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      return [];
    }

    // Get owned projects
    const ownedProjects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Get shared projects (where user is a team member)
    const memberships = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const sharedProjects = await Promise.all(
      memberships.map(async (m) => {
        const project = await ctx.db.get(m.projectId);
        return project
          ? { ...project, _teamRole: m.role as "editor" | "viewer" }
          : null;
      })
    );

    const validShared = sharedProjects.filter(
      (p): p is NonNullable<typeof p> => p !== null
    );

    // Combine: owned projects first (with owner role), then shared
    const owned = ownedProjects.map((p) => ({
      ...p,
      _teamRole: "owner" as const,
    }));

    const combined = [...owned, ...validShared];

    // Sort by lastEditedAt descending
    combined.sort(
      (a, b) =>
        new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime()
    );

    return combined;
  },
});

export const getById = query({
  args: { projectId: v.id("projects") },
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

    // Verify ownership or team membership
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have access to this project",
      });
    }

    const isOwner = project.userId === user._id;

    if (!isOwner) {
      // Check team membership
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_project_and_user", (q) =>
          q.eq("projectId", args.projectId).eq("userId", user._id)
        )
        .unique();

      if (!membership) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You do not have access to this project",
        });
      }

      return { ...project, _teamRole: membership.role as "owner" | "editor" | "viewer" };
    }

    return { ...project, _teamRole: "owner" as const };
  },
});

export const rename = mutation({
  args: { projectId: v.id("projects"), name: v.string() },
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

    await ctx.db.patch(args.projectId, {
      name: args.name.trim(),
      lastEditedAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
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
        message: "You do not have permission to delete this project",
      });
    }

    await ctx.db.delete(args.projectId);
  },
});
