"use client";

import { useEffect, useState } from "react";

interface AtmosphericBackgroundProps {
    variant?: "hero" | "features" | "how-it-works" | "showcase";
}

export default function AtmosphericBackground({ variant = "hero" }: AtmosphericBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base Background - Light */}
            <div className="absolute inset-0 bg-white" />

            {/* Depth Anchors */}
            {variant === "hero" && (
                <>
                    {/* Left Side Glow */}
                    <div className="absolute -top-[80%] -left-[15%] w-[70vw] h-[70vw] rounded-full bg-[#FF4D22] blur-[180px] opacity-[0.25] mix-blend-multiply" />
                    {/* Right Side Glow */}
                    <div className="absolute -top-[80%] -right-[25%] w-[70vw] h-[70vw] rounded-full bg-[#FF4D22] blur-[180px] opacity-[0.25] mix-blend-multiply" />
                </>
            )}

            {variant === "features" && (
                <>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-gray-100/10 to-transparent" />
                    <div className="absolute top-[20%] right-[-5%] w-[45%] h-[45%] rounded-full bg-gray-500/5 blur-[150px]" />
                    <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gray-500/5 blur-[150px]" />
                </>
            )}

            {variant === "how-it-works" && (
                <>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-gradient-to-b from-transparent via-[#FF4D22] opacity-[0.05] to-transparent blur-[200px]" />
                    <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-[#FF4D22] opacity-[0.05] blur-[200px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-[#FF4D22] opacity-[0.05] blur-[200px]" />
                </>
            )}

            {variant === "showcase" && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 via-white to-teal-50/20" />
                    <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-blue-500/3" />
                </>
            )}

            {/* Global Grain/Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
