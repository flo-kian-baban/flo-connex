"use client";

import { Search, MapPin } from 'lucide-react';
import CreatorStrip from './CreatorStrip';
import ScrollReveal from './ScrollReveal';
import AtmosphericBackground from './AtmosphericBackground';

interface HeroProps {
    pillText?: string;
    titleLine1?: React.ReactNode;
    titleHighlight?: string;
    description?: string;
    showSearch?: boolean;
    ctaText?: string;
    ctaLink?: string;
    onCtaClick?: () => void;
}

export default function Hero({
    pillText = "For Creators",
    titleLine1 = "Your Lifestyle.",
    titleHighlight = "Your Currency.",
    description = "Collaborate directly with businesses that love your style. No agencies, no chasing payments, just value.",
    showSearch = true,
    ctaText = "Find Collaborations",
    ctaLink = "/auth/signup",
    onCtaClick
}: HeroProps) {
    return (
        <section className="relative h-[100vh] pt-26 md:pt-48 pb-24 md:pb-32 overflow-hidden">
            <AtmosphericBackground variant="hero" />

            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">

                {/* Pill Label */}
                <ScrollReveal delay={100}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 md:mb-10 uppercase tracking-wider">
                        {pillText}
                    </div>
                </ScrollReveal>

                {/* Heading - Light Theme */}
                <ScrollReveal delay={200}>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 md:mb-10 text-balance leading-[1.1] text-gray-900">
                        {titleLine1} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 uppercase">{titleHighlight}</span>
                    </h1>
                </ScrollReveal>

                {/* Subtext - Light Theme */}
                <ScrollReveal delay={300}>
                    <p className="text-lg md:text-xl max-w-2xl mb-12 md:mb-16 leading-relaxed text-gray-500">
                        {description}
                    </p>
                </ScrollReveal>

                {/* Search Bar or CTA */}
                <ScrollReveal delay={400} distance="30px">
                    {showSearch ? (
                        <div className="w-full max-w-3xl bg-white p-2.5 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-2.5 hover:shadow-2xl transition-shadow duration-500">
                            {/* Input 1 */}
                            <div className="flex-1 flex items-center px-4 h-12 md:h-14 bg-gray-50 rounded-2xl md:bg-transparent">
                                <Search className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Service (e.g. Gym, Facial...)"
                                    className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            <div className="hidden md:block w-px h-8 bg-gray-200 self-center" />

                            <div className="flex-1 flex items-center px-4 h-12 md:h-14 bg-gray-50/50 rounded-2xl md:bg-transparent">
                                <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Your Location"
                                    className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            {/* Button */}
                            <button
                                onClick={onCtaClick || (() => window.location.href = ctaLink)}
                                className="h-12 md:h-auto px-10 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
                            >
                                {ctaText}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onCtaClick || (() => window.location.href = ctaLink)}
                                className="px-10 py-5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-lg lg:text-xl"
                            >
                                {ctaText}
                            </button>
                        </div>
                    )}
                </ScrollReveal>

                {/* Strip */}
                <ScrollReveal delay={600} direction="none">
                    <div className="mt-16 md:mt-24">
                        <CreatorStrip />
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
}
