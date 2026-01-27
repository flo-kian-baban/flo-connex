"use client";

import { Mail } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

export default function FinalCTA() {
    return (
        <section id="cta" className="py-24 md:py-32 px-4 md:px-8 relative overflow-hidden bg-white">
            <ScrollReveal distance="40px">
                <AtmosphericBackground variant="features" />
                <div className="max-w-6xl mx-auto backdrop-blur-xl bg-primary/[0.03] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden border border-primary/10 shadow-2xl shadow-slate-200/50">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl mx-auto leading-[1.1] text-gray-900">
                        Ready to upgrade <span className="text-primary">your lifestyle?</span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium text-gray-500">
                        Join the network where your content unlocks exclusive services and experiences, and CA$H.
                    </p>

                    <form
                        className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 justify-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            window.location.href = '/auth/signup';
                        }}
                    >
                        <div className="relative flex-1 group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full pl-14 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white shadow-sm transition-all text-base font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] text-base whitespace-nowrap"
                        >
                            Apply
                        </button>
                    </form>

                    <p className="text-xs font-bold text-gray-400 mt-8 uppercase tracking-[0.2em]">Free for creators. Always.</p>
                </div>
            </ScrollReveal>

        </section>
    );
}
