"use client";

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { creators } from '@/lib/data';

type CreatorProps = typeof creators[0];

export default function CreatorCard({ name, niche, rating, reviewsCount, avatarUrl, tags }: CreatorProps) {
    return (
        <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col items-center text-center relative overflow-hidden">

            {/* Background decorative gradient */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-gray-50 to-transparent" />

            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 z-10">
                <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Name & Niche */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 z-10">{name}</h3>
            <p className="text-sm text-primary font-medium mb-4 z-10">{niche}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center mb-6 z-10 w-full">
                {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-gray-50 text-xs font-semibold text-gray-600 border border-gray-100 group-hover:border-primary/10 group-hover:bg-primary/5 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-100 mb-4" />

            {/* Footer Stats */}
            <div className="flex items-center justify-between w-full mt-auto px-2">
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{rating}</span>
                </div>
                <span className="text-xs font-semibold text-gray-400">{reviewsCount} Reviews</span>
            </div>

            {/* Hover Effect Button (Hidden by default, slides in/fades in) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                <span className="text-sm font-bold text-primary">View Profile &rarr;</span>
            </div>
        </div>
    );
}
