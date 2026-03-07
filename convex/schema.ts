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
});
