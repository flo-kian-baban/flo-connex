"use client";

import { useState, useMemo } from "react";
import { DollarSign } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

interface EarningsCalculatorProps {
    cpm?: number;
}

export default function EarningsCalculator({ cpm = 3.00 }: EarningsCalculatorProps) {
    const [views, setViews] = useState<number>(10000);

    const earnings = useMemo(() => {
        return (views / 1000) * cpm;
    }, [views, cpm]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViews(Number(e.target.value));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatViews = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
        return count.toString();
    };

    const creatorTiers = [
        { label: "Micro", value: 100000 },
        { label: "Mid", value: 500000 },
        { label: "Macro", value: 1500000 },
    ];

    return (
        <section className="relative py-16 md:py-32 overflow-hidden bg-white">
            <AtmosphericBackground variant="features" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center">
                    {/* Left: Content & Input */}
                    <div>
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900 leading-[1.1]">
                                See what your<br />
                                <span className="text-primary">audience is worth.</span>
                            </h2>
                            <p className="text-lg md:text-xl leading-relaxed text-gray-500 mb-12">
                                Stop trading products for posts. With Connex, you get paid for every view you generate.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={100}>
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <label htmlFor="views-slider" className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                            Average Monthly Views
                                        </label>
                                        <div className="text-2xl font-bold text-gray-900 font-mono">
                                            {formatViews(views)} <span className="text-gray-400 text-lg font-normal">views/mo</span>
                                        </div>
                                    </div>

                                    <div className="relative h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                                            style={{ width: `${(views / 3000000) * 100}%` }}
                                        />
                                        <input
                                            id="views-slider"
                                            type="range"
                                            min="0"
                                            max="3000000"
                                            step="10000"
                                            value={views}
                                            onChange={handleSliderChange}
                                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg pointer-events-none transition-all duration-75"
                                            style={{ left: `${(views / 3000000) * 100}%`, transform: `translate(-50%, -50%)` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        <span>0</span>
                                        <span>750k</span>
                                        <span>1.5M</span>
                                        <span>2.25M</span>
                                        <span>3M</span>
                                    </div>
                                </div>

                                {/* Creator Tier Buttons */}
                                {/* <div className="flex flex-wrap gap-3">
                                    {creatorTiers.map((tier) => (
                                        <button
                                            key={tier.label}
                                            onClick={() => setViews(tier.value)}
                                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${views === tier.value
                                                ? "bg-gray-900 text-white shadow-lg scale-105"
                                                : "bg-white border border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary hover:bg-gray-50"
                                                }`}
                                        >
                                            {tier.label}
                                        </button>
                                    ))}
                                </div> */}
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: Result Display */}
                    <ScrollReveal delay={200} className="w-full h-full">
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary via-orange-400 to-yellow-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

                            <div className="relative bg-gray-900 rounded-[2.5rem] p-10 md:p-14 border border-gray-800 shadow-2xl overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary backdrop-blur-md mb-2">
                                        <DollarSign size={32} />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">Estimated Monthly Earnings</p>
                                        <div className="text-5xl md:text-7xl font-bold text-white tracking-tight tabular-nums transition-all duration-300">
                                            {formatCurrency(earnings)}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/10 w-full">
                                        <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                                            <span>Based on</span>
                                            <span className="text-white font-semibold bg-white/10 px-2 py-0.5 rounded text-xs">${cpm.toFixed(2)} CPM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
