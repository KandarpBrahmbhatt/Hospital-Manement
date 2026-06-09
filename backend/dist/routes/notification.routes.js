"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controller/notification.controller");
const auth_middleware_1 = require("../middaleware/auth.middleware");
const notificationRouter = express_1.default.Router();
// GET /api/notifications - Retrieve list of notifications. Protected by isAuth.
notificationRouter.get("/", auth_middleware_1.isAuth, notification_controller_1.getNotifications);
// PUT /api/notifications/read-all - Mark all notifications as read. Protected by isAuth.
notificationRouter.put("/read-all", auth_middleware_1.isAuth, notification_controller_1.markAllAsRead);
// PUT /api/notifications/:id/read - Mark a specific notification as read by ID. Protected by isAuth.
notificationRouter.put("/:id/read", auth_middleware_1.isAuth, notification_controller_1.markAsRead);
exports.default = notificationRouter;
