"use client";

import { useState } from "react";

interface ProfileImageProps {
    src?: string | null;
    name?: string | null;
    type: "creator" | "provider";
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export default function ProfileImage({
    src,
    name,
    type,
    size = "lg",
    className = "",
}: ProfileImageProps) {
    const [error, setError] = useState(false);

    const sizeClasses = {
        sm: "w-8 h-8 text-[10px]",
        md: "w-10 h-10 text-xs",
        lg: "w-11 h-11 text-sm",
        xl: "w-20 h-20 text-lg",
    };

    const shapeClasses = type === "creator" ? "rounded-full" : "rounded-xl";

    const getInitials = (n: string) => {
        return n
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const initials = name ? getInitials(name) : "?";

    // Standard fallback colors based on the first letter to keep it consistent
    const getBgColor = (char: string) => {
        const colors = [
            "bg-orange-100 text-orange-600",
            "bg-blue-100 text-blue-600",
            "bg-emerald-100 text-emerald-600",
            "bg-purple-100 text-purple-600",
            "bg-rose-100 text-rose-600",
            "bg-amber-100 text-amber-600",
        ];
        const code = char.charCodeAt(0) || 0;
        return colors[code % colors.length];
    };

    const fallbackClasses = getBgColor(initials[0]);

    if (src && !error) {
        return (
            <div className={`${sizeClasses[size]} ${shapeClasses} overflow-hidden border border-gray-100 shrink-0 ${className}`}>
                <img
                    src={src}
                    alt={name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={() => setError(true)}
                />
            </div>
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} ${shapeClasses} ${fallbackClasses} flex items-center justify-center font-black uppercase tracking-wider border border-gray-100 shrink-0 ${className}`}
        >
            {initials}
        </div>
    );
}
