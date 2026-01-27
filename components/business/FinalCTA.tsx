"use client";

import { Mail } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

export default function FinalCTA() {
    return (
        <section id="cta" className="py-24 md:py-32 px-4 md:px-8 relative overflow-hidden bg-black">
            <ScrollReveal distance="40px">
                <AtmosphericBackground variant="features" />
                <div className="max-w-7xl mx-auto bg-gradient-to-br rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden border shadow-2xl from-white/5 via-white/[0.02] to-white/5 border-white/10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
                        Ready to upgrade your lifestyle?
                    </h2>
                    <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-14 leading-relaxed font-medium text-gray-400">
                        Join the network where your content unlocks exclusive services and experiences.
                    </p>

                    <form
                        className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4 justify-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            window.location.href = '/auth/signup?type=business';
                        }}
                    >
                        <div className="relative flex-1 group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full pl-14 pr-6 py-5 rounded-2xl border border-white/10 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white/5 shadow-sm transition-all text-lg font-medium text-white placeholder:text-gray-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-3 transition-transform active:scale-[0.98] text-lg whitespace-nowrap"
                        >
                            Get Started
                        </button>
                    </form>

                    <p className="text-sm font-bold text-gray-400 mt-10 uppercase tracking-[0.2em]">Free for creators. Always.</p>
                </div>
            </ScrollReveal>
        </section>
    );
}
