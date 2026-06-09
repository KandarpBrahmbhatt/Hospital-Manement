import { Worker } from "bullmq";
import redis from "../config/redis";

new Worker(
  "emailQueue",
  async (job) => {
    console.log("Job Received");

    console.log(job.data);

    // Send email here

    console.log(
      `Email sent to ${job.data.email}`
    );
  },
  {
    // The option key for specifying the redis instance is 'connection', not 'redis'.
    // We cast 'redis as any' to resolve the TypeScript type mismatch issue between
    // package.json's 'ioredis' version and bullmq's internal 'ioredis' dependency.
    connection: redis as any,
  }
);


console.log("Worker Started");
