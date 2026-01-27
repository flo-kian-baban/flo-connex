"use client";

import { Quote, TrendingUp, Users, Zap } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

const CREATOR_CONTENT = [
    {
        type: "metric",
        value: "100%",
        label: "Verified Offers",
        icon: Zap,
    },
    {
        type: "wide",
        quote: "I've worked with five local brands this month alone. It's refreshing to skip the cold DMs and just apply to businesses that actually want to collaborate.",
        author: "Marcus Ray",
        role: "Lifestyle Creator",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
        type: "compact",
        quote: "The direct chat makes verifying expectations so much smoother.",
        author: "Chloe Kim",
        role: "Food Blogger",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
    },
    {
        type: "metric",
        value: "2X",
        label: "Faster Deal Flow",
        icon: TrendingUp,
    },
    {
        type: "compact",
        quote: "Consistent opportunities that actually fit my niche.",
        author: "Alex Rivera",
        role: "Fitness Coach",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    }
];

export default function BentoTestimonials() {
    const content = CREATOR_CONTENT;

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-gray-50/50">
            <AtmosphericBackground variant="showcase" />

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 leading-[1.1]">
                            Loved by <span className="text-gray-400">Creators.</span>
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto text-gray-500">
                            The platform of choice for creators looking for serious collaborations.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                    {/* Item 1: Metric Card */}
                    <ScrollReveal delay={100} className="lg:col-span-1">
                        <div className="h-full p-8 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col justify-between bg-white border-gray-100">
                            <p className="text-2xl font-medium leading-relaxed mb-6 text-gray-900">
                                "{content[2].quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                    <Image
                                        src={content[2].avatar as string}
                                        alt="Author"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm truncate text-gray-900">{content[2].author}</p>
                                    <p className="text-xs font-medium truncate text-gray-500">{content[2].role}</p>
                                </div>
                            </div>
                        </div>

                    </ScrollReveal>

                    {/* Item 2: Wide Testimonial */}
                    <ScrollReveal delay={200} className="lg:col-span-2 lg:row-span-1">
                        <div className="h-full p-8 md:p-10 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col justify-between bg-white border-gray-100">
                            <div className="mb-8">
                                <p className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-gray-900">
                                    "{content[1].quote}"
                                </p>
                            </div>
                            <div className="flex items-center gap-4 border-t pt-6 border-gray-50">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={content[1].avatar as string}
                                        alt="Author"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{content[1].author}</p>
                                    <p className="text-sm font-medium text-gray-500">{content[1].role}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Item 3: Compact Testimonial */}
                    <ScrollReveal delay={300} className="lg:col-span-1">
                        <div className="h-full p-8 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col justify-between bg-white border-gray-100">
                            <p className="text-2xl font-medium leading-relaxed mb-6 text-gray-900">
                                "{content[2].quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                    <Image
                                        src={content[2].avatar as string}
                                        alt="Author"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm truncate text-gray-900">{content[2].author}</p>
                                    <p className="text-xs font-medium truncate text-gray-500">{content[2].role}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>


                    {/* Item 4: Metric Card */}
                    <ScrollReveal delay={500} className="lg:col-span-1">
                        <div className="h-full p-8 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col justify-between group bg-white border-gray-100">
                            <div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-indigo-50">
                                    <TrendingUp className="w-5 h-5 text-gray-700" />
                                </div>
                                <h3 className="text-5xl font-black tracking-tighter mb-2 text-gray-900">{content[3].value}</h3>
                            </div>
                            <p className="font-medium px-2 py-1 rounded-lg inline-block self-start text-sm text-gray-500 bg-gray-50">
                                {content[3].label}
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Item 6: Brand/Trust Card */}
                    <ScrollReveal delay={600} className="lg:col-span-3">
                        <div className="h-full bg-gray-900 p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-colors" />

                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                                    Start Earning Today.
                                </h3>
                                <p className="text-gray-400 font-medium mb-6">Join the community.</p>
                                <span className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all cursor-pointer">
                                    Get Started <TrendingUp className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            </div>
        </section>
    );
}
