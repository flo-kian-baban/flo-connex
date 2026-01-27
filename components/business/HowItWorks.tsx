"use client";

import { businessSteps as defaultSteps } from "@/lib/data";
import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

interface Step {
    num: string;
    title: string;
    desc: string;
    videoUrl?: string;
}

interface HowItWorksProps {
    steps?: Step[];
}

export default function HowItWorks({ steps = defaultSteps }: HowItWorksProps) {
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
                rootMargin: "-20% 0px -20% 0px",
                threshold: 0.5,
            }
        );

        triggerRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [steps]);

    return (
        <section className="relative py-24 md:py-16 bg-black">
            <AtmosphericBackground variant="how-it-works" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-24 text-center">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                        How it works.
                    </h2>
                </ScrollReveal>
            </div>

            {/* Scroll Triggers */}
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

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 relative z-10 lg:min-h-[250vh] lg:items-start">

                {/* Left: Sticky Steps Panel - Dark Theme */}
                <div className="hidden lg:block h-[calc(100vh-6rem)] sticky top-48 flex flex-col justify-center gap-8">
                    {steps.map((step, idx) => {
                        const isActive = activeStep === idx;
                        return (
                            <div
                                key={step.num}
                                className={`rounded-[2rem] border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default overflow-hidden relative group ${isActive
                                    ? "p-10 border-white/10 bg-white/[0.08] shadow-2xl scale-100 opacity-100 ring-1 ring-white/5"
                                    : "py-6 px-10 border-transparent bg-transparent opacity-30 hover:opacity-50 blur-[0.5px] scale-95 saturate-0"
                                    }`}
                            >
                                {/* Active Indicator Line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-700 ${isActive ? "bg-primary opacity-100" : "bg-gray-200 opacity-0"}`} />

                                <div className={`flex items-center gap-4 transition-all duration-700 ${isActive ? "mb-4" : "mb-0"}`}>
                                    <span className={`text-xs font-bold tracking-[0.2em] uppercase border px-2 py-0.5 rounded-full transition-colors duration-500 ${isActive
                                        ? "text-primary border-primary/20 bg-primary/10"
                                        : "text-gray-500 border-gray-800"
                                        }`}>
                                        Step {step.num}
                                    </span>
                                </div>

                                <div className="transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                    <h3 className={`font-bold tracking-tight transition-all duration-500 leading-tight ${isActive ? "text-3xl mb-4" : "text-2xl mb-0"} ${isActive ? "text-white" : "text-gray-500"}`}>
                                        {step.title}
                                    </h3>
                                    <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                                        <p className="text-lg leading-relaxed font-medium transition-colors duration-700 delay-100 text-gray-400">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right: Sticky Video Reel Frame */}
                <div className="hidden lg:block h-[calc(100vh-6rem)] sticky top-48 flex flex-col justify-center">
                    <ScrollReveal direction="none" distance="0">
                        <div className="relative w-full aspect-[4/12] max-h-[700px] max-w-[470px] bg-gray-950 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
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
                                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-700"
                                            style={{ opacity: activeStep === idx ? 0.1 : 0.6 }} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl pl-1 transform transition-transform group-hover:scale-110 duration-500">
                                                <Play className="w-8 h-8 text-white fill-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/60 to-transparent">
                                            <p className="text-white font-bold text-xl mb-1">{step.title}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Now Playing</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Mobile View - Dark Theme */}
                <div className="lg:hidden py-12 space-y-16">
                    {steps.map((step, idx) => (
                        <div key={step.num} className="space-y-10 flex flex-col items-center text-center">
                            <ScrollReveal delay={idx * 100}>
                                <div className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 w-full">
                                    <span className="text-sm font-black tracking-[0.2em] uppercase text-primary mb-4 block">Step {step.num}</span>
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">{step.desc}</p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={idx * 150} distance="40px">
                                <div className="relative w-full aspect-[9/16] max-w-[320px] bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-900">
                                    <Image
                                        src={step.videoUrl || ""}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
