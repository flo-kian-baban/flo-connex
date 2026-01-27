"use client";

import { showcases } from "@/lib/data";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Showcase() {
    const allShowcases = [...showcases, ...showcases, ...showcases];
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxIndex = allShowcases.length - 3;

    const scrollNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const scrollPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(maxIndex);
        }
    };

    return (
        <section className="relative py-24 md:py-16 overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-8 mb-16 md:mb-16">
                    <ScrollReveal>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Recent Exchanges</h2>
                            <p className="text-lg md:text-xl leading-relaxed max-w-xl text-gray-400">Real experiences unlocked by Connex creators.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200} direction="right">
                        <div className="flex gap-4">
                            <button
                                onClick={scrollPrev}
                                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 active:scale-95 group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={scrollNext}
                                className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover shadow-lg hover:shadow-primary/30 transition-all active:scale-95 group"
                            >
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="relative w-full overflow-hidden">
                    <div
                        className="flex gap-6 md:gap-8 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        style={{
                            transform: `translateX(calc(-${currentIndex} * (100% + ${typeof window !== 'undefined' && window.innerWidth < 1024 ? '24px' : '32px'})))`
                        }}
                    >
                        {allShowcases.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className="relative shrink-0 w-[calc(100%-24px)] md:w-[calc(33.333%-24px)] aspect-[9/16] md:aspect-[4/5] lg:aspect-[9/16] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-lg select-none hover:shadow-2xl transition-all duration-500"
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 p-10 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-2xl transition-all group-hover:bg-primary group-hover:border-primary duration-500">
                                        <Play size={24} className="text-white fill-white ml-1" />
                                    </div>
                                    <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">{item.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <p className="text-white/70 text-base font-medium uppercase tracking-wider">{item.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
