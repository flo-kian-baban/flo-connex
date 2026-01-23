"use client";

import { steps } from "@/lib/data";
import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"));
                        setActiveStep(index);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -20% 0px", // Trigger when trigger-element is largely in view
                threshold: 0.5,
            }
        );

        triggerRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative bg-white pt-20">

            {/* Scroll Triggers (Invisible Layout) */}
            <div className="absolute inset-0 top-0 w-full pointer-events-none">
                {steps.map((_, idx) => (
                    <div
                        key={`trigger-${idx}`}
                        data-index={idx}
                        ref={(el) => { triggerRefs.current[idx] = el; }}
                        className="h-[80vh]"
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10 lg:min-h-[250vh] lg:items-start">

                {/* Left: Sticky Steps Panel */}
                <div className="hidden lg:block h-[calc(100vh-6rem)] sticky top-44 flex flex-col justify-center gap-6">
                    {steps.map((step, idx) => {
                        const isActive = activeStep === idx;
                        return (
                            <div
                                key={step.num}
                                className={`rounded-3xl border transition-all duration-500 ease-in-out cursor-default overflow-hidden ${isActive
                                    ? "p-8 border-[#FF4D22] bg-[#FF4D22]/5 shadow-md scale-105"
                                    : "p-6 border-transparent hover:border-gray-100 bg-white opacity-40 grayscale scale-100"
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <span className={`text-sm font-bold tracking-wider uppercase ${isActive ? "text-[#FF4D22]" : "text-gray-400"
                                        }`}>
                                        Step {step.num}
                                    </span>
                                    {!isActive && (
                                        <h3 className="text-xl font-bold text-gray-700">
                                            {step.title}
                                        </h3>
                                    )}
                                </div>

                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                    }`}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right: Sticky Video Reel Frame */}
                <div className="hidden lg:block h-[calc(100vh-6rem)] sticky top-44 flex flex-col justify-center">
                    <div className="relative w-full aspect-[9/16] max-h-[700px] bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto">
                        {/* Sliding Container */}
                        <div
                            className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            style={{ transform: `translateY(-${activeStep * 100}%)` }}
                        >
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative w-full h-full">
                                    <Image
                                        src={step.videoUrl || ""}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20" />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl pl-1">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    </div>

                                    {/* Caption Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white font-bold text-lg">{step.title}</p>
                                        <p className="text-white/60 text-sm">Now Playing</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile View (Standard Stack) */}
                <div className="lg:hidden py-12 space-y-16">
                    {steps.map((step, idx) => (
                        <div key={step.num} className="space-y-8 flex flex-col items-center text-center">
                            <div className="p-8 rounded-3xl border border-[#FF4D22]/20 bg-[#FF4D22]/5 w-full">
                                <span className="text-sm font-bold tracking-wider uppercase text-[#FF4D22] mb-3 block">Step {step.num}</span>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </div>
                            <div className="relative w-full aspect-[9/16] max-w-[300px] bg-gray-900 rounded-3xl overflow-hidden shadow-xl">
                                <Image
                                    src={step.videoUrl || ""}
                                    alt={step.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
