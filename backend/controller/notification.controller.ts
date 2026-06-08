import { Request, Response } from "express";
import Notification from "../models/notification.model";

/**
 * Controller to fetch all notifications in the system, sorted from newest to oldest.
 * Limit results to 100 for performance.
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    // Fetch notifications sorted by creation date in descending order
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error,
    });
  }
};

/**
 * Controller to mark a single notification as read using its document ID.
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Find the notification by ID and update the isRead field to true
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

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
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error,
    });
  }
};

/**
 * Controller to mark all unread notifications in the system as read.
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    // Update all notifications that currently have isRead set to false
    await Notification.updateMany({ isRead: false }, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read successfully",
    });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
      error,
    });
  }
};
