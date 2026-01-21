"use client";

import { categories, creators } from "@/lib/data";
import { useState } from "react";
import CreatorCard from "./CreatorCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CategoryDiscovery() {
    const [activeCat, setActiveCat] = useState(categories[0].id);

    return (
        <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 md:px-8">
            {/* Header */}
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-6xl font-bold text-gray-900 mb-14">Top Creators on Connex</h2>

                {/* Categories Tabs */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCat === cat.id
                                    ? "bg-[#E63F15] text-white shadow-lg scale-105"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {creators.slice(0, 8).map((creator) => (
                    <CreatorCard key={creator.id} {...creator} />
                ))}
            </div>

            <div className="text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                    View all creators <ArrowRight size={20} />
                </Link>
            </div>
        </section>
    );
}
