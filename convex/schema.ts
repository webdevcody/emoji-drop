import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
  ...rateLimitTables,
  emoji: defineTable({
    name: v.string(),
    emoji: v.string(),
    startX: v.number(),
    startY: v.number(),
    speed: v.number(),
  }),
});
