"use client";

import { faqs } from "@/lib/data";
import { useState } from "react";

export default function FAQ() {
    const [activeId, setActiveId] = useState<string | null>(null);

    const toggleItem = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Questions? We've got answers.
                    </h2>
                    <p className="text-md md:text-lg text-gray-600">
                        Everything you need to know about joining Connex.
                    </p>
                </div>

                {/* Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq) => {
                        const isOpen = activeId === faq.id;

                        return (
                            <div
                                key={faq.id}
                                className={`bg-white rounded-2xl border transition-all duration-200 ${isOpen
                                    ? 'border-primary/30 shadow-lg shadow-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => toggleItem(faq.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${faq.id}`}
                                >
                                    <span className={`font-semibold text-lg pr-8 transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                                        }`}>
                                        {faq.q}
                                    </span>

                                    {/* Chevron Icon */}
                                    <svg
                                        className={`w-5 h-5 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400 group-hover:text-gray-600'
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Answer Panel */}
                                <div
                                    id={`faq-answer-${faq.id}`}
                                    className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 pt-2">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Below FAQ */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="#cta"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                        Contact our team
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>

            </div>
        </section>
    );
}
