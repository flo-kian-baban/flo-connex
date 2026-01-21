"use client";

import { showcases } from "@/lib/data";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

export default function Showcase() {
    // Duplicate data to get 9 items (3 original * 3)
    const allShowcases = [...showcases, ...showcases, ...showcases];
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // We show 3 items at a time. The maximize index we can scroll to is (Total Items - Visible Items).
    // However, for a simple page-by-page feel or item-by-item:
    // If we want to scroll 1 by 1:
    const maxIndex = allShowcases.length - 3; // 9 - 3 = 6. 

    const scrollNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Optional: Loop back to start
            setCurrentIndex(0);
        }
    };

    const scrollPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            // Optional: Loop to end
            setCurrentIndex(maxIndex);
        }
    };

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Recent Exchanges</h2>
                        <p className="text-gray-500">Real experiences unlocked by Connex creators.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={scrollPrev}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-gray-600 active:scale-95 disabled:opacity-50"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel Window */}
                <div className="relative w-full overflow-hidden">
                    <div
                        className="flex gap-6 transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                    // Note: logic implies 3 items visible. 100% / 3 is roughly the slide amount. 
                    // But gap makes it tricky with percentage.
                    // Better approach: use `calc` in transform or strictly control width.
                    // Let's rely on standard grid behavior inside a flex layout or simpler:
                    // Move by pixels or simpler % if we assume items are exactly 1/3 width (minus gap).
                    // To be precise with gaps, it's better to translate by (100% + gap) / 3 but simpler is:
                    // Just make each item min-w-[calc(33.333%_-_16px)] (assuming gap-6 is 24px)
                    >
                        {allShowcases.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className="relative shrink-0 w-full md:w-[calc(33.333%-16px)] aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer shadow-lg select-none"
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                        <Play size={20} className="text-white fill-white ml-1" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                                    <p className="text-white/80 text-sm">{item.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
