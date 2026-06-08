import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
// Change: Import the socket context hook to access notifications data and actions
import { useSocket } from "../context/SocketContext";

// Change: Component to render the notification bell icon and an unread badge indicator
const BellIcon = ({ count }: { count: number }) => (
  <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors duration-200">
    <svg className="w-6 h-6 text-slate-600 hover:text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {count > 0 && (
      <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </div>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Change: Access websocket notifications state and handlers
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800">Hospital Management System</h2>

      <div className="flex items-center gap-4">
        {/* Change: Notification icon & dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none flex items-center">
            <BellIcon count={unreadCount} />
          </button>

          {/* Change: Dropdown view displaying the recent notifications list */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-slate-100 shadow-xl z-50 overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Change: Scrollable notifications list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && markAsRead(n._id)}
                      className={`p-4 hover:bg-slate-50/50 transition-colors cursor-pointer flex gap-3 items-start ${
                        !n.isRead ? "bg-indigo-50/10" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-semibold ${!n.isRead ? "text-slate-800" : "text-slate-500"}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${!n.isRead ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                          {n.message}
                        </p>
                      </div>
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-50 text-rose-600 font-medium rounded-lg hover:bg-rose-100 active:bg-rose-200 transition-colors duration-200 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;