"use client";

import { faqs } from "@/lib/data";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
    const [activeId, setActiveId] = useState<string | null>(null);

    const toggleItem = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="py-24 md:py-16 bg-black">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-16 md:mb-24">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-7xl font-bold mb-5 tracking-tight text-[#FF4D22]">
                            Questions?
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <p className="text-lg md:text-3xl leading-relaxed text-gray-400">
                            We've got answers.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Accordion - Dark Theme */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = activeId === faq.id;

                        return (
                            <ScrollReveal key={faq.id} delay={idx * 50}>
                                <div
                                    className={`rounded-[2rem] border transition-all duration-300 ${isOpen
                                        ? 'border-white/10 bg-white/[0.08] shadow-2xl ring-1 ring-white/5'
                                        : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                        }`}
                                >
                                    {/* Question Button */}
                                    <button
                                        onClick={() => toggleItem(faq.id)}
                                        className="w-full px-8 py-6 md:py-8 flex items-center justify-between text-left group"
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-answer-${faq.id}`}
                                    >
                                        <span className={`font-bold text-lg md:text-xl pr-8 transition-colors ${isOpen
                                            ? 'text-white'
                                            : 'text-gray-400 group-hover:text-gray-200'
                                            }`}>
                                            {faq.q}
                                        </span>

                                        {/* Chevron Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen
                                            ? 'bg-primary text-white rotate-180'
                                            : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white'
                                            }`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>

                                    {/* Answer Panel */}
                                    <div
                                        id={`faq-answer-${faq.id}`}
                                        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-8 pb-8 pt-2">
                                            <p className="text-lg leading-relaxed md:max-w-2xl text-gray-400">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
