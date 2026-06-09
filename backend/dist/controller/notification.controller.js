"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
/**
 * Controller to fetch all notifications in the system, sorted from newest to oldest.
 * Limit results to 100 for performance.
 */
const getNotifications = async (req, res) => {
    try {
        // Fetch notifications sorted by creation date in descending order
        const notifications = await notification_model_1.default.find()
            .sort({ createdAt: -1 })
            .limit(100);
        return res.status(200).json({
            success: true,
            data: notifications,
        });
    }
    catch (error) {
        console.error("getNotifications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error,
        });
    }
};
exports.getNotifications = getNotifications;
/**
 * Controller to mark a single notification as read using its document ID.
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the notification by ID and update the isRead field to true
        const notification = await notification_model_1.default.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Notification marked as read successfully",
            data: notification,
        });
    }
    catch (error) {
        console.error("markAsRead error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notification",
            error,
        });
    }
};
exports.markAsRead = markAsRead;
/**
 * Controller to mark all unread notifications in the system as read.
 */
const markAllAsRead = async (req, res) => {
    try {
        // Update all notifications that currently have isRead set to false
        await notification_model_1.default.updateMany({ isRead: false }, { isRead: true });
        return res.status(200).json({
            success: true,
            message: "All notifications marked as read successfully",
        });
    }
    catch (error) {
        console.error("markAllAsRead error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notifications",
            error,
        });
    }
};
exports.markAllAsRead = markAllAsRead;
