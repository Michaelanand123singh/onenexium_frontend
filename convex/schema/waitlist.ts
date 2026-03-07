import { defineTable } from "convex/server";
import { v } from "convex/values";

export const waitlistTable = defineTable({
  email: v.string(),
}).index("by_email", ["email"]);
