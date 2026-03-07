import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const join = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Please enter a valid email address",
      });
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      throw new ConvexError({
        code: "CONFLICT",
        message: "This email is already on the waitlist",
      });
    }

    await ctx.db.insert("waitlist", { email });
    return { success: true };
  },
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist").collect();
    return entries.length;
  },
});
