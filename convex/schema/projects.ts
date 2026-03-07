import { defineTable } from "convex/server";
import { v } from "convex/values";

export const projectsTable = defineTable({
  userId: v.id("users"),
  name: v.string(),
  description: v.string(),
  status: v.union(
    v.literal("generating"),
    v.literal("active"),
    v.literal("archived")
  ),
  prompt: v.string(),
  visibility: v.union(v.literal("public"), v.literal("private")),
  lastEditedAt: v.string(),
}).index("by_user", ["userId"]);

export const projectMessagesTable = defineTable({
  projectId: v.id("projects"),
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
  sentAt: v.string(),
}).index("by_project", ["projectId"]);
