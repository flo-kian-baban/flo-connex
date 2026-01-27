"use client";

import { heroStripCreators } from "@/lib/data";
import Image from "next/image";

export default function CreatorStrip() {
    return (
        <div className="w-full mt-12 md:mt-20 overflow-hidden relative">

            <div className="flex items-center justify-center">

                {/* Stacked Avatars & Badge */}
                <div className="flex items-center group cursor-pointer transition-all duration-500">
                    {heroStripCreators.map((src, idx) => (
                        <div
                            key={idx}
                            className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] border-white shadow-sm shrink-0 overflow-hidden transition-all duration-500 ease-in-out bg-gray-100 ${idx !== 0 ? '-ml-4 md:-ml-6 group-hover:ml-1 md:group-hover:-ml-4' : ''}`}
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
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] border-white shadow-sm shrink-0 flex items-center justify-center transition-all duration-500 ease-in-out z-10 bg-[#E63F15] text-white text-xs md:text-sm font-bold -ml-4 md:-ml-6 group-hover:ml-1 md:group-hover:ml-1">
                        5k+
                    </div>
                </div>

                {/* Text - Light theme text color */}
                <p className="text-sm text-gray-500 font-medium ml-4 whitespace-nowrap">Trusted by top creators</p>
            </div>
        </div>
    );
}
