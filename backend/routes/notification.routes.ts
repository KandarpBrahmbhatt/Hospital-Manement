import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notification.controller";
import { isAuth } from "../middaleware/auth.middleware";

const notificationRouter = express.Router();

// GET /api/notifications - Retrieve list of notifications. Protected by isAuth.
notificationRouter.get("/", isAuth, getNotifications);

// PUT /api/notifications/read-all - Mark all notifications as read. Protected by isAuth.
notificationRouter.put("/read-all", isAuth, markAllAsRead);

// PUT /api/notifications/:id/read - Mark a specific notification as read by ID. Protected by isAuth.
notificationRouter.put("/:id/read", isAuth, markAsRead);

export default notificationRouter;
