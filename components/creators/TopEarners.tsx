"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AtmosphericBackground from "./AtmosphericBackground";

interface Creator {
    id: string;
    name: string;
    niche: string;
    avatar: string;
    tags: string[];
    rating: number;
    earnings: string;
}

const INDUSTRIES = [
    "Skincare",
    "Aesthetics",
    "Fitness",
    "Dental",
    "Dining",
    "Travel",
    "Lifestyle",
];

const MOCK_CREATORS: Record<string, Creator[]> = {
    "Skincare": [
        { id: "1", name: "Sarah Jenkins", niche: "Beauty & Skincare", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", tags: ["UGC", "Reels", "TikTok"], rating: 4.9, earnings: "12.4K" },
        { id: "2", name: "David Chen", niche: "Product Testing", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop", tags: ["Tech", "Unboxing", "YouTube"], rating: 5.0, earnings: "8.9K" },
        { id: "3", name: "Elara V.", niche: "Dermatology Focus", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop", tags: ["Vlog", "Photo", "Hotel"], rating: 4.8, earnings: "21.5K" },
        { id: "4", name: "Marcus Ruth", niche: "Glow Expert", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop", tags: ["Fitness", "Training", "Shorts"], rating: 4.9, earnings: "5.6K" },
        { id: "5", name: "Priya Patel", niche: "Natural Beauty", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop", tags: ["Recipes", "ASMR", "Taste Test"], rating: 4.7, earnings: "31K" },
        { id: "6", name: "James Wilson", niche: "Male Grooming", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop", tags: ["Education", "Talking Head"], rating: 4.9, earnings: "4.2K" },
        { id: "7", name: "Chloe Moss", niche: "Aesthetic Core", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=150&auto=format&fit=crop", tags: ["DIY", "Styling", "Aesthetic"], rating: 4.8, earnings: "17.8K" },
        { id: "8", name: "Andre F.", niche: "Clear Skin Hub", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop", tags: ["Stream", "Twitch", "Clips"], rating: 5.0, earnings: "9.9K" },
    ],
    "Aesthetics": [
        { id: "9", name: "Juliana Reed", niche: "Interior Design", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop", tags: ["Decor", "Vlog", "Design"], rating: 4.9, earnings: "15.6K" },
        { id: "10", name: "Oscar Wilde", niche: "Portraiture", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=150&auto=format&fit=crop", tags: ["Photography", "Edit"], rating: 4.8, earnings: "7.2K" },
        { id: "11", name: "Mia Sofia", niche: "Fashion Curation", avatar: "https://images.unsplash.com/photo-1544717297-fa95b3ee21f3?q=80&w=150&auto=format&fit=crop", tags: ["Outfits", "Lookbook"], rating: 4.9, earnings: "20.3K" },
        { id: "12", name: "Lucas Gray", niche: "Minimalist Living", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=150&auto=format&fit=crop", tags: ["Tips", "Home"], rating: 4.7, earnings: "8.8K" },
        { id: "13", name: "Ava Thorne", niche: "Fine Art", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop", tags: ["Painting", "Tutorial"], rating: 5.0, earnings: "14.2K" },
        { id: "14", name: "Ethan Hunt", niche: "Cinematic Content", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop", tags: ["Video", "Transitions"], rating: 4.9, earnings: "11K" },
        { id: "15", name: "Sophie Bell", niche: "Floral Styling", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=150&auto=format&fit=crop", tags: ["Events", "Gardening"], rating: 4.8, earnings: "9.5K" },
        { id: "16", name: "Noah Ark", niche: "Digital Art", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=150&auto=format&fit=crop", tags: ["Procreate", "Speedpaint"], rating: 4.9, earnings: "6.7K" },
    ],
    "Fitness": [
        { id: "17", name: "Rex Strong", niche: "Bodybuilding", avatar: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=150&auto=format&fit=crop", tags: ["Training", "Diet"], rating: 5.0, earnings: "24.5K" },
        { id: "18", name: "Lily Flex", niche: "Yoga & Mindset", avatar: "https://images.unsplash.com/photo-1533101506915-eb58df9ec42e?q=80&w=150&auto=format&fit=crop", tags: ["Flow", "Meditation"], rating: 4.9, earnings: "18.2K" },
        { id: "19", name: "Tom Run", niche: "Marathon Pro", avatar: "https://images.unsplash.com/photo-1492562080023-ab3dbdf9bbbd?q=80&w=150&auto=format&fit=crop", tags: ["Endurance", "Gear"], rating: 4.8, earnings: "13.4K" },
        { id: "20", name: "Zoe Fit", niche: "HIIT Specialist", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop", tags: ["Fast", "Results"], rating: 4.7, earnings: "9.9K" },
        { id: "21", name: "Ben Lift", niche: "Powerlifting", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop", tags: ["Strength", "Coach"], rating: 4.9, earnings: "15.6K" },
        { id: "22", name: "Eva Move", niche: "Pilates", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop", tags: ["Core", "Flex"], rating: 4.8, earnings: "8.7K" },
        { id: "23", name: "Sam Sport", niche: "Nutritionist", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop", tags: ["Meal Prep", "Macros"], rating: 5.0, earnings: "21.2K" },
        { id: "24", name: "Kim Dash", niche: "Sprint Coach", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop", tags: ["Track", "Speed"], rating: 4.9, earnings: "7.4K" },
    ],
    // Add default data for others to avoid empty states
};

// Fill in other industries with randomized Skincare data for demo purposes
INDUSTRIES.forEach(industry => {
    if (!MOCK_CREATORS[industry]) {
        MOCK_CREATORS[industry] = MOCK_CREATORS["Skincare"].map(c => ({
            ...c,
            id: `${industry}-${c.id}`,
            niche: `${industry} Enthusiast`,
            earnings: `+${(Math.random() * 20 + 3).toFixed(1)}K`
        }));
    }
});

export default function TopEarners() {
    const [activeTab, setActiveTab] = useState(INDUSTRIES[0]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const creators = useMemo(() => MOCK_CREATORS[activeTab], [activeTab]);

    const handleTabChange = (industry: string) => {
        if (industry === activeTab) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveTab(industry);
            setIsTransitioning(false);
        }, 300);
    };

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-gray-50/30">
            <AtmosphericBackground variant="features" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-gray-900 leading-[1.1]">
                            Top <span className="text-gray-400">Earners.</span>
                        </h2>
                    </ScrollReveal>
                </div>

                {/* Tabs */}
                <ScrollReveal delay={100}>
                    <div className="flex justify-start md:justify-center mb-16 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0">
                        <div className="flex gap-3 md:gap-4 whitespace-nowrap">
                            {INDUSTRIES.map((industry) => {
                                const isActive = activeTab === industry;
                                return (
                                    <button
                                        key={industry}
                                        onClick={() => handleTabChange(industry)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                            : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-gray-200 hover:bg-white hover:text-gray-900"
                                            }`}
                                    >
                                        {industry}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Grid */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                    }`}>
                    {creators.map((creator, idx) => (
                        <ScrollReveal key={creator.id} delay={idx * 50}>
                            <div className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
                                {/* Hover Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-primary/20 transition-all duration-500 shadow-sm relative z-10">
                                        <Image
                                            src={creator.avatar}
                                            alt={creator.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight group-hover:text-primary transition-colors">{creator.name}</h3>
                                <p className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">{creator.niche}</p>


                                <div className="w-full pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-primary">
                                            <Star size={16} fill="currentColor" />
                                        </div>
                                        <span className="text-sm font-black text-gray-900">{creator.rating}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">+${creator.earnings}</span>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Footer CTA */}
                {/* <ScrollReveal delay={600}>
                    <div className="mt-20 text-center">
                        <a
                            href="/creators/board"
                            className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-sm group hover:gap-4 transition-all duration-300"
                        >
                            View all creators
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </ScrollReveal> */}
            </div>
        </section>
    );
}
