"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

interface VideoStep {
    num: string;
    title: string;
    subtitle: string;
    videoSrc: string;
    coverSrc: string;
}

const videoSteps: VideoStep[] = [
    {
        num: "01",
        title: "Connect",
        subtitle: "Find brands that match your vibe and niche.",
        videoSrc: "/videos/connect.mp4",
        coverSrc: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", // Placeholder
    },
    {
        num: "02",
        title: "Create",
        subtitle: "Do what you do best—create content.",
        videoSrc: "/videos/create.mp4",
        coverSrc: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop", // Placeholder
    },
    {
        num: "03",
        title: "Exchange",
        subtitle: "Get paid for every view you generate.",
        videoSrc: "/videos/exchange.mp4",
        coverSrc: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop", // Placeholder
    },
];

export default function HowItWorks() {
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    return (
        <section className="relative py-16 md:py-32 overflow-hidden bg-white">
            <AtmosphericBackground variant="how-it-works" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-20 text-center relative z-10">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 leading-[1.1]">
                        How it <span className="text-gray-400">works.</span>
                    </h2>
                </ScrollReveal>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Responsive Grid: 1 col mobile, 3 cols desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 group/container">
                    {videoSteps.map((step, idx) => {
                        // Logic:
                        // 1. If nothing is hovered, everyone is "neutral" (readable but not popping).
                        // 2. If something IS hovered:
                        //    - The hovered item is ACTIVE.
                        //    - Others are INACTIVE (dimmed).
                        // 3. On Mobile (hover not applicable): we treat as "nothing hovered" or always active?
                        //    Let's make default state = fully visible.
                        //    Hover state = specific highlight.

                        const isHovered = hoveredStep === idx;
                        const isAnyHovered = hoveredStep !== null;
                        const isDimmed = isAnyHovered && !isHovered;

                        return (
                            <div
                                key={step.num}
                                onMouseEnter={() => setHoveredStep(idx)}
                                onMouseLeave={() => setHoveredStep(null)}
                                className={`relative aspect-[9/16] h-[95%] rounded-[2.5rem] overflow-hidden group transition-all duration-500 ease-out border border-gray-100 ${isHovered
                                    ? "scale-[1.02] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] ring-4 ring-primary/10 opacity-100 grayscale-0 z-10"
                                    : isDimmed
                                        ? "scale-[0.98] opacity-100"
                                        : "scale-100 opacity-100 grayscale-0 shadow-lg"
                                    }`}
                            >
                                {/* Cover Image */}
                                <Image
                                    src={step.coverSrc}
                                    alt={step.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Video (Overlaid) */}
                                <video
                                    src={step.videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Fullscreen Dark Overlay */}
                                <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? "bg-black/30" : "bg-black/60"
                                    }`} />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className={`transition-all duration-500 transform ${isHovered || !isAnyHovered
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-0 opacity-60"
                                        }`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${isHovered
                                                ? "bg-primary text-white"
                                                : "bg-white/20 text-white/80"
                                                }`}>
                                                Step {step.num}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-white/80 text-base font-medium leading-relaxed max-w-[90%]">
                                            {step.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Active State Highlight Border/Glow */}
                                <div className={`absolute inset-0 rounded-[2.5rem] border-2 transition-colors duration-500 pointer-events-none ${isHovered ? "border-primary/50" : "border-white/10"
                                    }`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
