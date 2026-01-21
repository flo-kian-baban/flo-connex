"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastType } from '@/components/ui/Toast';

import { usePathname } from 'next/navigation';

interface ToastData {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);

        // Auto-hide after 5 seconds
        setTimeout(() => hideToast(id), 5000);
    }, [hideToast]);

    // Determine positioning based on route
    const isAuthPage = pathname?.startsWith('/auth');
    const positionClasses = isAuthPage
        ? "fixed top-6 right-6 z-[99999] flex flex-col gap-3 items-end pointer-events-none"
        : "fixed top-28 right-4 md:top-32 md:right-8 z-[2147483647] flex flex-col gap-3 items-end pointer-events-none md:mt-20 pt-10 pr-4";

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {mounted && createPortal(
                <div className={positionClasses}>
                    {toasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto transition-all duration-300 ease-in-out">
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                onClose={() => hideToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>,
                document.body
            )}
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
