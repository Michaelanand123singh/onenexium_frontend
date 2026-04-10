import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const inviteByEmail = mutation({
  args: {
    projectId: v.id("projects"),
    email: v.string(),
    role: v.union(v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
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

    // Verify the user is the project owner or has editor role
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Project not found" });
    }

    const isOwner = project.userId === user._id;
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_project_and_user", (q) =>
        q.eq("projectId", args.projectId).eq("userId", user._id)
      )
      .unique();

    if (!isOwner && (!membership || membership.role !== "editor")) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only the project owner or editors can invite members" });
    }

    // Can't invite yourself
    if (user.email && user.email.toLowerCase() === args.email.toLowerCase()) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "You cannot invite yourself" });
    }

    // Check if already invited (pending)
    const existingInvite = await ctx.db
      .query("teamInvites")
      .withIndex("by_project_and_email", (q) =>
        q.eq("projectId", args.projectId).eq("email", args.email.toLowerCase())
      )
      .unique();

    if (existingInvite && existingInvite.status === "pending") {
      throw new ConvexError({ code: "CONFLICT", message: "This person already has a pending invite" });
    }

    // Check if already a team member (by looking up user by email)
    const existingUsers = await ctx.db.query("users").collect();
    const targetUser = existingUsers.find(
      (u) => u.email && u.email.toLowerCase() === args.email.toLowerCase()
    );

    if (targetUser) {
      if (targetUser._id === project.userId) {
        throw new ConvexError({ code: "CONFLICT", message: "This person is the project owner" });
      }

      const existingMember = await ctx.db
        .query("teamMembers")
        .withIndex("by_project_and_user", (q) =>
          q.eq("projectId", args.projectId).eq("userId", targetUser._id)
        )
        .unique();

      if (existingMember) {
        throw new ConvexError({ code: "CONFLICT", message: "This person is already a team member" });
      }
    }

    // Create or update invite
    if (existingInvite) {
      await ctx.db.patch(existingInvite._id, {
        role: args.role,
        status: "pending",
        invitedAt: new Date().toISOString(),
        invitedBy: user._id,
      });
      return existingInvite._id;
    }

    return await ctx.db.insert("teamInvites", {
      projectId: args.projectId,
      email: args.email.toLowerCase(),
      role: args.role,
      invitedBy: user._id,
      status: "pending",
      invitedAt: new Date().toISOString(),
    });
  },
});

export const acceptInvite = mutation({
  args: { inviteId: v.id("teamInvites") },
  handler: async (ctx, args) => {
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

    const invite = await ctx.db.get(args.inviteId);
    if (!invite) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Invite not found" });
    }

    if (invite.status !== "pending") {
      throw new ConvexError({ code: "BAD_REQUEST", message: "This invite is no longer pending" });
    }

    // Verify email matches
    if (!user.email || user.email.toLowerCase() !== invite.email.toLowerCase()) {
      throw new ConvexError({ code: "FORBIDDEN", message: "This invite is for a different email address" });
    }

    // Add as team member
    await ctx.db.insert("teamMembers", {
      projectId: invite.projectId,
      userId: user._id,
      role: invite.role,
      invitedBy: invite.invitedBy,
      joinedAt: new Date().toISOString(),
    });

    // Mark invite as accepted
    await ctx.db.patch(args.inviteId, { status: "accepted" });

    return invite.projectId;
  },
});

export const declineInvite = mutation({
  args: { inviteId: v.id("teamInvites") },
  handler: async (ctx, args) => {
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

    const invite = await ctx.db.get(args.inviteId);
    if (!invite) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Invite not found" });
    }

    if (invite.status !== "pending") {
      throw new ConvexError({ code: "BAD_REQUEST", message: "This invite is no longer pending" });
    }

    if (!user.email || user.email.toLowerCase() !== invite.email.toLowerCase()) {
      throw new ConvexError({ code: "FORBIDDEN", message: "This invite is for a different email address" });
    }

    await ctx.db.patch(args.inviteId, { status: "declined" });
  },
});

export const removeMember = mutation({
  args: {
    projectId: v.id("projects"),
    memberId: v.id("teamMembers"),
  },
  handler: async (ctx, args) => {
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

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Project not found" });
    }

    const member = await ctx.db.get(args.memberId);
    if (!member || member.projectId !== args.projectId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Member not found" });
    }

    // Only project owner can remove members, or members can remove themselves
    const isOwner = project.userId === user._id;
    const isSelf = member.userId === user._id;

    if (!isOwner && !isSelf) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only the project owner can remove members" });
    }

    await ctx.db.delete(args.memberId);
  },
});

export const updateMemberRole = mutation({
  args: {
    memberId: v.id("teamMembers"),
    role: v.union(v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
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

    const member = await ctx.db.get(args.memberId);
    if (!member) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Member not found" });
    }

    const project = await ctx.db.get(member.projectId);
    if (!project) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Project not found" });
    }

    // Only project owner can change roles
    if (project.userId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only the project owner can change roles" });
    }

    await ctx.db.patch(args.memberId, { role: args.role });
  },
});

export const cancelInvite = mutation({
  args: { inviteId: v.id("teamInvites") },
  handler: async (ctx, args) => {
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

    const invite = await ctx.db.get(args.inviteId);
    if (!invite) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Invite not found" });
    }

    const project = await ctx.db.get(invite.projectId);
    if (!project) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Project not found" });
    }

    // Only project owner or inviter can cancel
    if (project.userId !== user._id && invite.invitedBy !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "You do not have permission to cancel this invite" });
    }

    await ctx.db.delete(args.inviteId);
  },
});

export const listMembers = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
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

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Project not found" });
    }

    // Check access: must be owner or team member
    const isOwner = project.userId === user._id;
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_project_and_user", (q) =>
        q.eq("projectId", args.projectId).eq("userId", user._id)
      )
      .unique();

    if (!isOwner && !membership) {
      throw new ConvexError({ code: "FORBIDDEN", message: "You do not have access to this project" });
    }

    // Get owner info
    const owner = await ctx.db.get(project.userId);

    // Get all team members
    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Enrich with user data
    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const memberUser = await ctx.db.get(member.userId);
        return {
          ...member,
          name: memberUser?.name ?? "Unknown",
          email: memberUser?.email ?? "",
          avatarUrl: memberUser?.avatarUrl,
        };
      })
    );

    return {
      owner: owner
        ? {
            _id: owner._id,
            name: owner.name ?? "Unknown",
            email: owner.email ?? "",
            avatarUrl: owner.avatarUrl,
          }
        : null,
      members: enrichedMembers,
      isOwner,
      currentUserRole: isOwner ? ("owner" as const) : (membership?.role ?? null),
    };
  },
});

export const listPendingInvites = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
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

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Project not found" });
    }

    // Only owner and editors can see pending invites
    const isOwner = project.userId === user._id;
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_project_and_user", (q) =>
        q.eq("projectId", args.projectId).eq("userId", user._id)
      )
      .unique();

    if (!isOwner && (!membership || membership.role !== "editor")) {
      return [];
    }

    const invites = await ctx.db
      .query("teamInvites")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return invites.filter((i) => i.status === "pending");
  },
});

export const listMyInvites = query({
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

    if (!user || !user.email) {
      return [];
    }

    const invites = await ctx.db
      .query("teamInvites")
      .withIndex("by_email", (q) => q.eq("email", user.email!.toLowerCase()))
      .collect();

    // Enrich with project info
    const pendingInvites = invites.filter((i) => i.status === "pending");

    const enriched = await Promise.all(
      pendingInvites.map(async (invite) => {
        const project = await ctx.db.get(invite.projectId);
        const inviter = await ctx.db.get(invite.invitedBy);
        return {
          ...invite,
          projectName: project?.name ?? "Unknown Project",
          inviterName: inviter?.name ?? "Someone",
        };
      })
    );

    return enriched;
  },
});
