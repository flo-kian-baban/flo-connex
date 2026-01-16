"use client";

import { heroStripCreators } from "@/lib/data";
import Image from "next/image";

export default function CreatorStrip() {
    return (
        <div className="w-full mt-12 md:mt-20 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex items-center justify-center">

                {/* Stacked Avatars & Badge */}
                <div className="flex -space-x-4 md:-space-x-6 items-center hover:space-x-1 transition-all duration-300">
                    {heroStripCreators.map((src, idx) => (
                        <div
                            key={idx}
                            className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] border-white shadow-sm shrink-0 overflow-hidden hover:scale-110 hover:z-10 transition-transform duration-300 cursor-pointer bg-gray-100"
                        >
                            <Image
                                src={src}
                                alt="Creator"
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}

                    {/* Badge integrated into stack */}
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] border-white shadow-sm shrink-0 flex items-center justify-center bg-[#E63F15]-50 text-xs md:text-sm font-bold text-white hover:scale-110 hover:z-10 transition-transform duration-300 z-10 bg-[#E63F15]">
                        5k+
                    </div>
                </div>

                {/* Text */}
                <p className="text-sm text-gray-500 font-medium ml-4 whitespace-nowrap">Trusted by top creators</p>
            </div>
        </div>
    );
}
