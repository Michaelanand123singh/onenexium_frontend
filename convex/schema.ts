import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    hasCompletedOnboarding: v.boolean(),
  }).index("by_token", ["tokenIdentifier"]),

  waitlist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),

  projects: defineTable({
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
  }).index("by_user", ["userId"]),

  projectMessages: defineTable({
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sentAt: v.string(),
  }).index("by_project", ["projectId"]),
});
