import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
// Change: Import the socket context hook to access notifications data and actions
import { useSocket, type NotificationData } from "../context/SocketContext";

// Change: Component to render the notification bell icon and an unread badge indicator
const BellIcon = ({ count }: { count: number }) => (
  <div className="relative cursor-pointer p-2.5 hover:bg-slate-50 rounded-full transition-colors duration-200 border border-slate-100 shadow-sm bg-white">
    <svg className="w-5.5 h-5.5 text-slate-600 hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse border border-white">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </div>
);

// Change: Visual icons for different notification categories
const EmergencyAlertIcon = () => (
  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 shrink-0">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  </div>
);

const AppointmentConfirmedIcon = () => (
  <div className="p-2 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shrink-0">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

const DefaultReminderIcon = () => (
  <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 shrink-0">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

const DefaultSystemIcon = () => (
  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Change: Access websocket notifications state and handlers
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Change: Modal state to hold the currently viewed notification
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Change: Auto-close notifications dropdown when user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  // Change: Action handler for clicking a notification item
  const handleNotificationClick = (n: NotificationData) => {
    // Open detailed modal
    setSelectedNotification(n);
    // Mark as read in db/state if it is unread
    if (!n.isRead) {
      markAsRead(n._id);
    }
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-slate-100 relative">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Hospital Management System</h2>

      <div className="flex items-center gap-5">
        {/* Change: Notification icon & dropdown container */}
        <div className="relative flex items-center" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none flex items-center">
            <BellIcon count={unreadCount} />
          </button>

          {/* Change: Dropdown view displaying the recent notifications list with improved UI */}
          {showDropdown && (
            <div className="absolute right-0 top-12 mt-1.5 w-96 bg-white rounded-xl border border-slate-100 shadow-xl z-50 overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Change: Scrollable notifications list with category icons */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => {
                    // Choose icon by checking keywords in the title/message
                    let icon = <DefaultSystemIcon />;
                    const titleLower = n.title.toLowerCase();
                    if (titleLower.includes("emergency") || titleLower.includes("alert")) {
                      icon = <EmergencyAlertIcon />;
                    } else if (titleLower.includes("confirm") || titleLower.includes("book")) {
                      icon = <AppointmentConfirmedIcon />;
                    } else if (titleLower.includes("reminder") || titleLower.includes("warning")) {
                      icon = <DefaultReminderIcon />;
                    }

                    return (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer flex gap-3.5 items-start ${
                          !n.isRead ? "bg-indigo-50/20" : ""
                        }`}
                      >
                        {icon}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className={`text-xs font-semibold truncate ${!n.isRead ? "text-slate-800" : "text-slate-500"}`}>
                              {n.title}
                            </span>
                            <span className="text-[9px] text-slate-400 shrink-0 ml-2">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-xs truncate ${!n.isRead ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                            {n.message}
                          </p>
                        </div>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-indigo-600 mt-2 shrink-0 animate-pulse" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-50 text-rose-600 font-medium rounded-lg hover:bg-rose-100 active:bg-rose-200 transition-colors duration-200 cursor-pointer text-sm"
        >
          Logout
        </button>
      </div>

      {/* Change: Glassmorphic Modal showing notification details when clicked */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden transform scale-100 transition-all">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Notification Detail</h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Title</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">{selectedNotification.title}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Message</div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedNotification.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Received On</div>
                  <div className="text-xs text-slate-700 mt-1">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${selectedNotification.isRead ? "bg-slate-300" : "bg-indigo-600"}`} />
                    <span className="text-xs text-slate-700 font-medium">{selectedNotification.isRead ? "Read" : "Unread"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;