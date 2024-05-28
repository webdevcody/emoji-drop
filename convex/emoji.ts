import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import Filter from "bad-words";

const badWordFilter = new Filter();

export const dropEmoji = mutation({
  args: {
    name: v.string(),
    startX: v.number(),
    startY: v.number(),
  },
  async handler(ctx, args) {
    const emojis = ["😁", "😱", "👍", "😛", "🤓", "🥺", "😎"];
    await ctx.db.insert("emoji", {
      name: badWordFilter.clean(args.name),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      startX: args.startX,
      startY: args.startY,
      speed: Math.floor(Math.random() * 3) + 2,
    });
  },
});

export const getRecentEmojis = query({
  async handler(ctx) {
    return ctx.db.query("emoji").order("desc").take(50);
  },
});

export const clearAll = mutation({
  async handler(ctx) {
    const emojis = await ctx.db.query("emoji").collect();
    await Promise.all(emojis.map((emoji) => ctx.db.delete(emoji._id)));
  },
});
