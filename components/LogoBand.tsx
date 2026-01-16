"use client";

import { logos } from "@/lib/data";

export default function LogoBand() {
    return (
        <section className="py-12 border-y border-gray-50 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 text-center overflow-hidden relative mask-linear-fade">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-12">
                    Top brands hiring on Connex
                </p>

                <div className="flex overflow-hidden group select-none">
                    <div className="flex gap-20 animate-scroll shrink-0 min-w-full items-center justify-around pr-14">
                        {logos.map((logo) => (
                            <div key={logo.id} className="text-xl md:text-2xl font-bold text-gray-400 font-sans flex items-center gap-2 min-w-max">
                                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                                {logo.name}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-16 animate-scroll shrink-0 min-w-full items-center justify-around pr-16" aria-hidden="true">
                        {logos.map((logo) => (
                            <div key={`${logo.id}-dup`} className="text-xl md:text-2xl font-bold text-gray-400 font-sans flex items-center gap-2 min-w-max">
                                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                                {logo.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
