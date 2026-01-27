"use client";

import { ShieldCheck, Zap, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

interface FeaturesOrbitProps {
    heading?: React.ReactNode;
    subHeading?: string;
    description?: string;
    feature1?: { title: string; desc: string; cardLabel?: string };
    feature2?: { title: string; desc: string };
    feature3?: { title: string; desc: string };
    feature4?: { title: string; desc: string };
}

export default function FeaturesOrbit({
    heading = <>Scale with <br /></>,
    subHeading = "Control.",
    description = "Eliminate the guesswork of influencer marketing. You see exactly what you're paying for.",
    feature1 = { title: "Post Your Collaboration", desc: "Define your goals, budget, and deliverables upfront. No vague contracts.", cardLabel: "Offer Posted" },
    feature2 = { title: "Vetted Creators", desc: "Work only with creators who have proven engagement in your specific niche." },
    feature3 = { title: "Direct Communication", desc: "Chat directly with creators. No account managers in the middle." },
    feature4 = { title: "Measurable ROI", desc: "Track every post and performance metric from a single dashboard." }
}: FeaturesOrbitProps) {
    return (
        <section className="relative py-24 md:py-10 overflow-hidden bg-black">
            <AtmosphericBackground variant="features" />

            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                            {heading}
                            <span className="text-gray-600">{subHeading}</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={50}>
                        <p className="text-lg md:text-xl leading-relaxed text-gray-400">
                            {description}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8 min-h-[600px]">

                    {/* 1. Large Feature - Spans 4 cols */}
                    <ScrollReveal className="md:col-span-4 h-full" delay={200}>
                        <div className="h-full rounded-[2.5rem] p-8 md:p-14 border shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group flex flex-col justify-between hover:-translate-y-1 bg-white/5 border-white/10">
                            <div className="relative z-10 max-w-md">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 transition-transform group-hover:scale-110 duration-500">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">{feature1.title}</h3>
                                <p className="text-lg leading-relaxed text-gray-400">{feature1.desc}</p>
                            </div>

                            {/* Abstract UI Visualization */}
                            <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-96 h-full hidden md:flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-0 translate-x-12">
                                <div className="relative w-full h-80">
                                    {/* Back card */}
                                    <div className="absolute top-0 right-12 border shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-4 w-64 rotate-6 transform transition-transform group-hover:rotate-12 duration-700 bg-white/5 border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                                            <div className="space-y-1.5 w-full">
                                                <div className="h-2.5 w-24 bg-white/10 rounded" />
                                                <div className="h-2 w-16 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded mb-1.5" />
                                        <div className="h-2 w-3/4 bg-white/5 rounded" />
                                    </div>

                                    {/* Front Match Card */}
                                    <div className="absolute top-20 right-20 border shadow-[0_8px_40px_rgb(0,0,0,0.08)] rounded-2xl p-5 w-72 -rotate-3 border-l-4 border-l-primary z-10 transform transition-transform group-hover:-rotate-6 duration-700 bg-white/5 border-white/10">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-white">Offer Accepted!</span>
                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{feature1.cardLabel}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded mb-2" />
                                        <div className="flex gap-1">
                                            <div className="h-1.5 w-1/3 bg-primary rounded" />
                                            <div className="h-1.5 w-1/4 bg-primary rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 2. Tall Feature (Verified) - Spans 2 cols, 2 rows */}
                    <ScrollReveal className="md:col-span-2 md:row-span-2 h-full" delay={300}>
                        <div className="h-full bg-gray-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group flex flex-col justify-between hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 backdrop-blur-md transition-transform group-hover:scale-110 duration-500">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{feature2.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{feature2.desc}</p>
                            </div>

                            {/* Verification Matrix */}
                            <div className="relative h-56 w-full mt-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center overflow-hidden gap-4 px-4 group-hover:bg-white/10 transition-colors duration-500">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`w-24 h-32 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 transition-all duration-700 ${i === 2 ? 'bg-white/10 scale-110 shadow-2xl shadow-black/40 border-white/10 z-10 group-hover:scale-125' : 'opacity-40 group-hover:opacity-20'}`}>
                                        <div className="w-12 h-12 rounded-full bg-white/10" />
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 3. Medium Feature (Chat) - Spans 2 cols */}
                    <ScrollReveal className="md:col-span-2 h-full" delay={400}>
                        <div className="h-full bg-gradient-to-br from-primary to-orange-600 rounded-[2.5rem] p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group text-white hover:-translate-y-1">
                            <MessageCircle size={40} className="mb-8 opacity-90 transition-transform group-hover:scale-110 duration-500" />
                            <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature3.title}</h3>
                            <p className="text-white/80 text-lg leading-relaxed">{feature3.desc}</p>

                            <div className="absolute -bottom-20 -right-14 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                                <MessageCircle size={200} />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 4. Medium Feature - Spans 2 cols */}
                    <ScrollReveal className="md:col-span-2 h-full" delay={500}>
                        <div className="h-full bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative hover:-translate-y-1">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 transition-transform group-hover:scale-110 duration-500">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">{feature4.title}</h3>
                                <p className="text-lg leading-relaxed text-gray-400">{feature4.desc}</p>
                            </div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover:scale-150" />
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
