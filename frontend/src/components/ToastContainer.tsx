import React from "react";
import { useSocket } from "../context/SocketContext";

// Change: Simple inline SVG Icons to keep the component light and avoid runtime import failures
const SuccessIcon = () => (
  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSocket();

  // If there are no active toast alerts, do not render anything
  if (toasts.length === 0) return null;

  return (
    // Change: Fixed styling layout positioning toast alerts at the top-right overlay layer
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let icon = <InfoIcon />;
        let borderClass = "border-indigo-100";
        let titleClass = "text-indigo-800";
        let bgClass = "bg-indigo-50/90";

        // Style customizing based on Toast category
        if (toast.type === "success") {
          icon = <SuccessIcon />;
          borderClass = "border-emerald-100";
          titleClass = "text-emerald-800";
          bgClass = "bg-emerald-50/90";
        } else if (toast.type === "error") {
          icon = <ErrorIcon />;
          borderClass = "border-rose-100";
          titleClass = "text-rose-800";
          bgClass = "bg-rose-50/90";
        } else if (toast.type === "warning") {
          icon = <WarningIcon />;
          borderClass = "border-amber-100";
          titleClass = "text-amber-800";
          bgClass = "bg-amber-50/90";
        }

        return (
          // Change: Glassmorphism and slide-in look for notifications
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${bgClass} ${borderClass}`}
            role="alert"
          >
            {icon}
            <div className="flex-1">
              <h4 className={`text-sm font-semibold leading-tight ${titleClass}`}>{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-normal">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 hover:bg-slate-100/50 rounded-lg transition-colors cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default ToastContainer;
