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
        <section className="py-16 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-24">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 leading-[1.1]">
                            Questions? <span className="text-gray-400">We've got answers.</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <p className="text-lg md:text-xl leading-relaxed text-gray-500">
                            Everything you need to know about joining Connex.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Accordion - Light Theme */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = activeId === faq.id;

                        return (
                            <ScrollReveal key={faq.id} delay={idx * 50}>
                                <div
                                    className={`bg-white rounded-[2rem] border transition-all duration-300 ${isOpen
                                        ? 'border-primary/30 shadow-xl shadow-primary/5 bg-gray-50/30'
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                        }`}
                                >
                                    {/* Question Button */}
                                    <button
                                        onClick={() => toggleItem(faq.id)}
                                        className="w-full px-8 py-6 md:py-8 flex items-center justify-between text-left group"
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-answer-${faq.id}`}
                                    >
                                        <span className={`font-bold text-lg md:text-xl pr-8 transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                                            }`}>
                                            {faq.q}
                                        </span>

                                        {/* Chevron Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>

                                    {/* Answer Panel */}
                                    <div
                                        id={`faq-answer-${faq.id}`}
                                        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-8 pb-8 pt-2">
                                            <p className="text-lg leading-relaxed md:max-w-2xl text-gray-500">
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
