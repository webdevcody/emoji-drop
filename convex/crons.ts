import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "drop a random named emoji",
  { seconds: 5 },
  internal.emoji.dropInternal
);
export default crons;
