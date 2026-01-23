"use client";

import { Search, MapPin } from 'lucide-react';
import CreatorStrip from './CreatorStrip';

export default function Hero() {
    return (
        <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden">
            {/* Background Gradient Removed */}

            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">

                {/* Pill Label */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-10 uppercase tracking-wide">
                    Create Content. Get Access.
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 md:mb-10 text-balance leading-[1.1]">
                    YOUR CONTENT. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 uppercase">Real Experiences.</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-14 leading-relaxed">
                    Access exclusive services and premium experiences in exchange for your content. No payments, just value.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-3xl bg-white p-2 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-2">
                    {/* Input 1 */}
                    <div className="flex-1 flex items-center px-4 h-12 md:h-14 bg-gray-50 rounded-2xl md:bg-transparent">
                        <Search className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                        <input
                            type="text"
                            placeholder="Service (e.g. Gym, Facial...)"
                            className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="hidden md:block w-px h-8 bg-gray-200 self-center" />

                    <div className="flex-1 flex items-center px-4 h-12 md:h-14 bg-gray-50/50 rounded-2xl md:bg-transparent">
                        <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                        <input
                            type="text"
                            placeholder="Your Location"
                            className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => window.location.href = '/auth/signup'}
                        className="h-12 md:h-auto px-8 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-colors shadow-md transition-transform active:scale-95"
                    >
                        Find Offers
                    </button>
                </div>

                {/* Strip */}
                <CreatorStrip />

            </div>
        </section>
    );
}
