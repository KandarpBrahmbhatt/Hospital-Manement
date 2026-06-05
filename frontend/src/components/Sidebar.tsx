import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/patients", label: "Patients", icon: "👥" },
    { path: "/doctors", label: "Doctors", icon: "🩺" },
    { path: "/medical-records", label: "Medical Records", icon: "📝" },
    { path: "/appointments", label: "Appointments", icon: "📅" },
    { path: "/bills", label: "Billing", icon: "💳" },
    { path: "/insurance", label: "Insurance", icon: "🛡️" },
    { path: "/emergency", label: "Emergency", icon: "🚨" },
    { path: "/token", label: "Token Queue", icon: "🎫" },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none shrink-0 font-sans sticky top-0">
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20">
            H
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            CareFlow HMS
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <span className="text-base shrink-0">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-300">
            ST
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Staff Access</div>
            <div className="text-[10px] text-slate-500">Connected Securely</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;