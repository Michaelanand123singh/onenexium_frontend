import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usersTable = defineTable({
  tokenIdentifier: v.string(),
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  hasCompletedOnboarding: v.boolean(),
}).index("by_token", ["tokenIdentifier"]);
