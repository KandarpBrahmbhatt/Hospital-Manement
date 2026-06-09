import { Router } from "express";
// Import the emailQueue we created in queues/email.queues.ts
import { emailQueue } from "../queues/email.queues";

const testRouter = Router();

// Test route to add a job to the email queue.
// When a GET request is made to /test-bullmq, it adds a new send-email job to the queue.
testRouter.get("/", async (req, res) => {
  try {
    await emailQueue.add("send-email", {
      email: "kandarp@gmail.com",
    });

    res.json({
      success: true,
      message: "Job Added Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default testRouter;
