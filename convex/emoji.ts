import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import Filter from "bad-words";
import { defineRateLimits } from "convex-helpers/server/rateLimit";

const badWordFilter = new Filter();

function getRandomEmoji() {
  const emojis = ["😁", "😱", "👍", "😛", "🤓", "🥺", "😎"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

const { rateLimit } = defineRateLimits({
  dropEmojiLimit: { kind: "token bucket", rate: 1, period: 3000 },
});

export const dropEmoji = mutation({
  args: {
    name: v.string(),
    startX: v.number(),
    startY: v.number(),
  },
  async handler(ctx, args) {
    const { ok, retryAt } = await rateLimit(ctx, { name: "dropEmojiLimit" });
    if (!ok) return { retryAt };

    await ctx.db.insert("emoji", {
      name: badWordFilter.clean(args.name),
      emoji: getRandomEmoji(),
      startX: args.startX,
      startY: args.startY,
      speed: Math.floor(Math.random() * 3) + 2,
    });
  },
});

export const dropInternal = internalMutation({
  args: {},
  async handler(ctx, args) {
    const shortName = uniqueNamesGenerator({
      dictionaries: [names],
    });

    await ctx.db.insert("emoji", {
      name: shortName,
      emoji: getRandomEmoji(),
      startX: Math.floor(Math.random() * 800) + 50,
      startY: Math.floor(Math.random() * 600) + 50,
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
