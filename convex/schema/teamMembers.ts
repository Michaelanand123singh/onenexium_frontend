import { defineTable } from "convex/server";
import { v } from "convex/values";

export const teamMembersTable = defineTable({
  projectId: v.id("projects"),
  userId: v.id("users"),
  role: v.union(
    v.literal("owner"),
    v.literal("editor"),
    v.literal("viewer")
  ),
  invitedBy: v.id("users"),
  joinedAt: v.string(),
})
  .index("by_project", ["projectId"])
  .index("by_user", ["userId"])
  .index("by_project_and_user", ["projectId", "userId"]);

export const teamInvitesTable = defineTable({
  projectId: v.id("projects"),
  email: v.string(),
  role: v.union(
    v.literal("editor"),
    v.literal("viewer")
  ),
  invitedBy: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("declined")
  ),
  invitedAt: v.string(),
})
  .index("by_project", ["projectId"])
  .index("by_email", ["email"])
  .index("by_project_and_email", ["projectId", "email"]);
