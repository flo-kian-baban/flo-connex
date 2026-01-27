"use client";

import { logos } from "@/lib/data";

export default function LogoBand() {
    return (
        <section className="py-24 md:py-32 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <p className="text-center text-sm font-bold uppercase tracking-[0.2em] mb-12 text-gray-600">
                    Trusted by Premium Brands
                </p>

                <div className="relative flex overflow-hidden mask-linear-fade">
                    <div className="flex gap-16 md:gap-32 animate-scroll whitespace-nowrap items-center py-2">
                        {[...logos, ...logos, ...logos].map((logo, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 text-xl md:text-2xl font-black hover:text-primary transition-all duration-500 cursor-default select-none tracking-tighter group grayscale hover:grayscale-0 text-gray-600"
                            >
                                <div className="w-8 h-8 rounded-full group-hover:bg-primary/10 transition-colors bg-gray-500" />
                                {logo.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
