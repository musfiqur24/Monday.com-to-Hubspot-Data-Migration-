import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  useEffect(() => {
    window.UI = window.UI || {};
    window.UI.toast = (message, type = 'info') => showToast(message, type);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-20 right-6 z-[100000] flex flex-col gap-2.5 w-[min(400px,calc(100vw-32px))] pointer-events-none">
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 border rounded-xl bg-white shadow-xl pointer-events-auto transition-all animate-in slide-in-from-top-2 duration-200 ${
                isError
                  ? 'border-rose-200 bg-rose-50/50'
                  : isSuccess
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Info className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs font-semibold text-slate-800 block">
                  {isError ? 'Something needs attention' : isSuccess ? 'Success' : 'Notification'}
                </strong>
                <p className="text-xs text-slate-600 m-0 mt-0.5 leading-relaxed break-words whitespace-pre-line">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

