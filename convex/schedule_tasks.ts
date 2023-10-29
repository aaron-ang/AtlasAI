import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
    args: {startTime: v.string(), deadline: v.string(), isFixed: v.boolean(), title: v.string(), duration: v.number(), priority: v.number()},
    handler: async (ctx, {startTime, deadline, isFixed, title, duration, priority}) => {
      await ctx.db.insert("tasks", {startTime, deadline, isFixed, title, duration, priority});
    },
  });