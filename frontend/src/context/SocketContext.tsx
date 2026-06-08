import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from "../services/notificationApi";

// Change: Define structured Types for notifications and active floating toasts
export interface NotificationData {
  _id: string;
  title: string;
  message: string;
  notificationtype: "EMAIL" | "SMS" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

export interface ToastData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

interface SocketContextType {
  socket: Socket | null;
  notifications: NotificationData[];
  unreadCount: number;
  toasts: ToastData[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type: ToastData["type"]) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Change: Custom Web Audio API utility to play notification sounds dynamically without depending on external asset files.
const playSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = "sine";
    // Play a pleasant, high-pitched double-beep
    osc.frequency.setValueAtTime(660.00, audioContext.currentTime); // E5
    osc.frequency.setValueAtTime(880.00, audioContext.currentTime + 0.12); // A5
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.3);
  } catch (err) {
    console.error("Synthesizer audio cue error:", err);
  }
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Calculate total unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Retrieve user authentication status from Redux store to trigger connection
  const user = useSelector((state: any) => state.auth.user);

  // Change: Helper function to trigger manual toast notifications from anywhere
  const showToast = (title: string, message: string, type: ToastData["type"] = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto-dismiss toast after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Change: Fetch notification list from database
  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsApi();
      if (res.data && res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch initial notifications:", err);
    }
  };

  // Change: Call API to mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      await markAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Change: Call API to mark all system notifications as read
  const markAllAsRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast("Success", "All notifications marked as read", "success");
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  // Change: Effect hook to manage Socket connection state lifecycle based on user presence
  useEffect(() => {
    // If user is logged out, clear notifications and disconnect socket
    if (!user) {
      setNotifications([]);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Initialize connection to socket server running on port 5000
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connection established! Socket ID:", newSocket.id);
    });

    // Handle incoming real-time notifications
    newSocket.on("newNotification", (data: NotificationData) => {
      console.log("Real-time notification arrived:", data);
      
      setNotifications((prev) => {
        // Prevent duplicate updates
        if (prev.some((n) => n._id === data._id)) return prev;
        return [data, ...prev];
      });

      // Play double-beep audio alert
      playSound();

      // Categorize toast type based on keywords in title
      let toastType: ToastData["type"] = "info";
      const titleLower = data.title.toLowerCase();
      if (titleLower.includes("emergency") || titleLower.includes("alert")) {
        toastType = "error";
      } else if (titleLower.includes("confirm") || titleLower.includes("success") || titleLower.includes("book")) {
        toastType = "success";
      } else if (titleLower.includes("reminder") || titleLower.includes("warning")) {
        toastType = "warning";
      }

      showToast(data.title, data.message, toastType);
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected.");
    });

    setSocket(newSocket);
    
    // Load existing database notifications
    fetchNotifications();

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        toasts,
        markAsRead,
        markAllAsRead,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
