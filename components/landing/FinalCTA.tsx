"use client";

import { ArrowRight, Mail } from "lucide-react";

export default function FinalCTA() {
    return (
        <section id="cta" className="py-16 md:py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#FFEDEA] to-white rounded-[2.5rem] p-8 md:p-20 text-center relative overflow-hidden border border-primary/20">

                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -z-10" />

                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Ready to upgrade your lifestyle?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                    Join the network where your content unlocks exclusive services and experiences.
                </p>

                <form
                    className="max-w-md mx-auto flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        window.location.href = '/auth/signup';
                    }}
                >
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        Apply for Access <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-6">Free for creators. Always.</p>

            </div>
        </section>
    );
}
