"use client";

import { useState, createContext, useContext, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
};

type LoginPromptOptions = {
  message: string;
  onLogin: () => void;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showLoginPrompt: (options: LoginPromptOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<{
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);
  const [loginPrompt, setLoginPrompt] = useState<LoginPromptOptions | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirm({ options, resolve });
    });
  }, []);

  const showLoginPrompt = useCallback((options: LoginPromptOptions) => {
    setLoginPrompt(options);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleConfirm = (val: boolean) => {
    confirm?.resolve(val);
    setConfirm(null);
  };

  const iconMap = {
    success: <CheckCircle size={20} className="text-[#e43f3e]" />,
    error: <XCircle size={20} className="text-[#e43f3e]" />,
    warning: <AlertTriangle size={20} className="text-amber-500" />,
    info: <Info size={20} className="text-blue-500" />,
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm, showLoginPrompt }}>
      {children}

      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 px-5 py-4 shadow-xl min-w-[320px] max-w-[420px]"
            style={{ animation: "toastSlideIn 0.3s ease-out forwards" }}
          >
            {iconMap[toast.type]}
            <p className="flex-1 text-sm font-medium text-black dark:text-white">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-black dark:hover:text-white transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => handleConfirm(false)} />
          <div
            className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-[400px] p-8 z-10 border border-gray-200 dark:border-gray-800 shadow-2xl"
            style={{ animation: "toastSlideIn 0.2s ease-out forwards" }}
          >
            <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
              {confirm.options.title}
            </h3>
            <div className="w-10 h-1 bg-[#e43f3e] mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">{confirm.options.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {confirm.options.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                  confirm.options.variant === "danger"
                    ? "bg-[#e43f3e] text-white hover:bg-black dark:hover:bg-white dark:hover:text-black"
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-[#e43f3e] hover:text-white dark:hover:bg-[#e43f3e]"
                }`}
              >
                {confirm.options.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loginPrompt && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setLoginPrompt(null)} />
          <div
            className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-[400px] p-8 z-10 border border-gray-200 dark:border-gray-800 shadow-2xl text-center"
            style={{ animation: "toastSlideIn 0.2s ease-out forwards" }}
          >
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-[#e43f3e]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e43f3e" strokeWidth="2" strokeLinecap="square">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
              Login Required
            </h3>
            <div className="w-10 h-1 bg-[#e43f3e] mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">{loginPrompt.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setLoginPrompt(null)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  loginPrompt.onLogin();
                  setLoginPrompt(null);
                }}
                className="flex-1 py-3 bg-[#e43f3e] text-white text-sm font-bold uppercase tracking-wider hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
