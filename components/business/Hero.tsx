"use client";

import { Search, MapPin } from 'lucide-react';
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
    pillText = "For Business",
    titleLine1 = "More Results.",
    titleHighlight = "Less Friction.",
    description = "Connect with trusted, niche creators who distribute authentic content. No ads, no agencies, just ROI.",
    showSearch = false,
    ctaText = "Get Started",
    ctaLink = "/auth/signup?type=business",
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

                {/* Heading - Dark Theme */}
                <ScrollReveal delay={200}>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 md:mb-10 text-balance leading-[1.1] text-white">
                        {titleLine1} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 uppercase">{titleHighlight}</span>
                    </h1>
                </ScrollReveal>

                {/* Subtext - Dark Theme */}
                <ScrollReveal delay={300}>
                    <p className="text-lg md:text-xl max-w-2xl mb-12 md:mb-16 leading-relaxed text-gray-400">
                        {description}
                    </p>
                </ScrollReveal>

                {/* Search Bar or CTA */}
                <ScrollReveal delay={400} distance="30px">
                    {showSearch ? (
                        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-2.5 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row gap-2.5 hover:shadow-2xl transition-shadow duration-500">
                            {/* Input 1 */}
                            <div className="flex-1 flex items-center px-4 h-12 md:h-14 bg-white/5 rounded-2xl">
                                <Search className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Service (e.g. Gym, Facial...)"
                                    className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 font-medium"
                                />
                            </div>

                            <div className="hidden md:block w-px h-8 bg-white/10 self-center" />

                            <div className="flex-1 flex items-center px-4 h-12 md:h-14 bg-white/5 rounded-2xl">
                                <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Your Location"
                                    className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 font-medium"
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

            </div>
        </section>
    );
}
