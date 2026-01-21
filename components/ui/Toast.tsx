"use client";

import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
    const styles = {
        success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
        error: 'bg-red-50 border-red-100 text-red-800',
        info: 'bg-blue-50 border-blue-100 text-blue-800',
    };

    const Icons = {
        success: CheckCircle2,
        error: AlertCircle,
        info: Info,
    };

    const Icon = Icons[type];

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-toast-in w-full max-w-[400px] ${styles[type]}`}
        >
            <Icon className="w-6 h-6 shrink-0" />

            <p className="text-xs font-bold flex-1 pt-0.5 leading-relaxed">{message}</p>

            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Close notification"
            >
                <X className="w-4 h-4 opacity-50" />
            </button>
        </div>
    );
}
