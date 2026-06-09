// import { Queue } from "bullmq";
// import redis from "../config/redis";

// // Initialize the email queue using BullMQ.
// // We cast the redis client instance 'as any' to avoid TypeScript compilation errors.
// // This is because the outer 'ioredis' version in package.json mismatch with the nested
// // dependency 'ioredis' used internally by 'bullmq', leading to nominal class incompatibility.
// export const emailQueue = new Queue("emailQueue", {
//   connection: redis as any,
// });



import { Queue } from "bullmq";
import redis from "../config/redis";

export const emailQueue = new Queue("emailQueue", {
  connection: redis as any,
});