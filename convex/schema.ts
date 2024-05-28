import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  emoji: defineTable({
    name: v.string(),
    emoji: v.string(),
    startX: v.number(),
    startY: v.number(),
    speed: v.number(),
  }),
});
