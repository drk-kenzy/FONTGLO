"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastAction = { label: string; onClick: () => void };

type Toast = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  action?: ToastAction;
};

const ToastContext = createContext({
  addToast: (message: string, type?: Toast["type"], action?: ToastAction) => {},
});

export function useToasts() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "info", action?: ToastAction) => {
      const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
      setToasts((t) => [...t, { id, message, type, action }]);
      setTimeout(() => {
        setToasts((t) => t.filter((tt) => tt.id !== id));
      }, 4000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm px-4 py-2 rounded-sm text-sm shadow-md border flex items-center gap-3 ${t.type === "error" ? "bg-red-50 border-red-200 text-red-800" : t.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-white border-sepia-200 text-sepia-800"}`}
          >
            <div className="flex-1">{t.message}</div>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                }}
                className="text-sm underline ml-2"
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
