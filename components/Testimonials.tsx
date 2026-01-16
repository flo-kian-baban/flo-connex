"use client";

import { testimonials } from "@/lib/data";
import { Quote } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
    const t = testimonials[0]; // Display the first one for MVP

    return (
        <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center md:text-left">What our clients say</h2>

            <div className="flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden shadow-2xl">

                {/* Left: Quote */}
                <div className="flex-1 bg-gray-900 p-8 md:p-16 flex flex-col justify-center relative">
                    <Quote className="text-primary w-12 h-12 mb-8 fill-primary" />
                    <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed mb-8">
                        "{t.quote}"
                    </p>
                    <div>
                        <p className="text-white font-bold text-lg">{t.name}</p>
                        <p className="text-gray-400">{t.role}</p>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="flex-1 relative min-h-[400px]">
                    <Image
                        src={t.imageUrl}
                        alt={t.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/10 md:to-transparent" />
                </div>

            </div>
        </section>
    );
}
