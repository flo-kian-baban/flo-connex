"use client";

import { ShieldCheck, Zap, MessageCircle } from "lucide-react";

export default function FeaturesOrbit() {
    return (
        <section className="py-24 md:py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Experience more. <br />
                        <span className="text-gray-400">Pay with content.</span>
                    </h2>
                    <p className="text-lg text-gray-500">
                        Connex opens doors to premium services and experiences in exchange for your creativity.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 min-h-[600px]">

                    {/* 1. Large Feature (Speed) - Spans 4 cols */}
                    <div className="md:col-span-4 bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                        <div className="relative z-10 max-w-md">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Match Your Lifestyle</h3>
                            <p className="text-gray-500 text-lg leading-relaxed">Find services that fit your daily life. From gym memberships to dining, get it in exchange for content.</p>
                        </div>

                        {/* Abstract UI Visualization - Right Side */}
                        <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-96 h-full hidden md:flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-8">
                            <div className="relative w-full h-80">
                                {/* Back card */}
                                <div className="absolute top-0 right-12 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-4 w-64 rotate-6 transform transition-transform group-hover:rotate-12 duration-500">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                                        <div className="space-y-1.5 w-full">
                                            <div className="h-2.5 w-24 bg-gray-100 rounded" />
                                            <div className="h-2 w-16 bg-gray-50 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded mb-1.5" />
                                    <div className="h-2 w-3/4 bg-gray-50 rounded" />
                                </div>

                                {/* Front Match Card */}
                                <div className="absolute top-20 right-20 bg-white border border-green-100 shadow-[0_8px_40px_rgb(0,0,0,0.08)] rounded-2xl p-5 w-72 -rotate-3 border-l-4 border-l-[#E63F15] z-10 transform transition-transform group-hover:-rotate-6 duration-500">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-gray-900">Offer Accepted!</span>
                                        <span className="text-[10px] bg-[#E63F15]-10 text-[#E63F15] px-2 py-0.5 rounded-full font-bold">Gym Access</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded mb-2" />
                                    <div className="flex gap-1">
                                        <div className="h-1.5 w-1/3 bg-[#E63F15] rounded" />
                                        <div className="h-1.5 w-1/4 bg-[#E63F15] rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Tall Feature (Verified) - Spans 2 cols, 2 rows */}
                    <div className="md:col-span-2 md:row-span-2 bg-gray-900 rounded-[2rem] p-8 md:p-10 border border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-md">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Verified Only</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">We review every applicant. High standards ensure you get access to the best partners.</p>
                        </div>

                        {/* Verification Matrix Viz */}
                        <div className="relative h-48 w-full mt-8 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden gap-3 px-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-20 h-28 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-3 transition-colors ${i === 2 ? 'bg-white/10 scale-110 shadow-xl shadow-black/20 border-white/10 z-10' : 'opacity-50'}`}>
                                    <div className="w-10 h-10 rounded-full bg-white/10" />
                                    <div className="w-6 h-6 rounded-full bg-[#E63F15]/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#E63F15]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Medium Feature (Chat) - Spans 2 cols */}
                    <div className="md:col-span-2 bg-gradient-to-br from-primary to-orange-600 rounded-[2rem] p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-white">
                        <MessageCircle size={36} className="mb-6 opacity-90" />
                        <h3 className="text-2xl font-bold mb-2 tracking-tight">Direct Chat</h3>
                        <p className="text-white/80 text-lg leading-relaxed">Discuss deliverables directly with business owners.</p>

                        <div className="absolute -bottom-20 -right-14 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                            <MessageCircle size={200} />
                        </div>
                    </div>

                    {/* 4. Medium Feature (Analytics/Payments) - Spans 2 cols */}
                    <div className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <Zap size={28} />
                            </div>                            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Exchange Value</h3>
                            <p className="text-gray-500 text-lg leading-relaxed">Get the service. Create the content.</p>
                        </div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    </div>
                </div>
            </div>
        </section>
    );
}
