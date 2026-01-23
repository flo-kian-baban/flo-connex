"use client";

import Link from "next/link";
import { MapPin, Instagram, Youtube, Video } from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";
import TikTokIcon from "@/components/ui/TikTokIcon";

interface CreatorCardProps {
    creator: {
        id: string;
        display_name: string;
        avatar_url: string | null;
        primary_niche: string;
        content_style_tags: string[];
        location_area: string;
        primary_platform: string;
        follower_range: string;
        avg_views_range: string;
        engagement_range: string;
    };
}

export default function CreatorCard({ creator }: CreatorCardProps) {
    const getPlatformIcon = (platform: string) => {
        const p = (platform || "").toLowerCase();
        if (p.includes("instagram")) return <Instagram className="w-4 h-4" />;
        if (p.includes("tiktok")) return <TikTokIcon className="w-4 h-4" />;
        if (p.includes("youtube")) return <Youtube className="w-4 h-4" />;
        return <Video className="w-4 h-4" />;
    };

    return (
        <Link
            href={`/provider/creator/${creator.id}`}
            className="group relative flex flex-col items-center bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden"
        >
            {/* Platform Icon Badge (Top Right) */}
            <div className="absolute top-5 right-5 z-20">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 border border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                    {getPlatformIcon(creator.primary_platform)}
                </div>
            </div>

            {/* Avatar - Centered & Larger */}
            <div className="relative mb-4 mt-2">
                <div className="p-1 rounded-full border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300">
                    <ProfileImage
                        src={creator.avatar_url}
                        name={creator.display_name}
                        type="creator"
                        className="w-24 h-24 text-2xl shadow-sm"
                    />
                </div>
                {/* Optional: Add verified badge or status here if needed later */}
            </div>

            {/* Info - Centered */}
            <div className="text-center mb-6 w-full relative z-10">
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors duration-300 truncate px-2">
                    {creator.display_name}
                </h3>

                <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">{creator.location_area || "Remote"}</span>
                </div>

                {/* Primary Niche Badge */}
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/10">
                    {creator.primary_niche || "Creator"}
                </span>
            </div>

            {/* Minimal Stats Row */}
            <div className="w-full mt-auto pt-5 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Followers</p>
                        <p className="text-sm font-black text-gray-900">{creator.follower_range}</p>
                    </div>
                    <div className="text-center border-l border-gray-100/50">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Views</p>
                        <p className="text-sm font-black text-gray-900">{creator.avg_views_range}</p>
                    </div>
                    <div className="text-center border-l border-gray-100/50">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Engage</p>
                        <p className="text-sm font-black text-gray-900">{creator.engagement_range}</p>
                    </div>
                </div>
            </div>

            {/* Hover visual cue (bottom bar or subtle gradient) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </Link>
    );
}
