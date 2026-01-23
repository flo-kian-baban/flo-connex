"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, MapPin, Instagram, Youtube, Video, Star, ArrowLeft, Send } from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";
import TikTokIcon from "@/components/ui/TikTokIcon";
import RequestModal from "@/components/dashboard/explore/RequestModal";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

interface CreatorProfile {
    id: string;
    user_id: string;
    display_name: string;
    bio: string;
    avatar_url: string | null;
    primary_niche: string;
    secondary_niches: string[];
    content_style_tags: string[];
    location_area: string;
    service_areas: string[];
    primary_platform: string;
    active_platforms: string[];
    follower_range: string;
    avg_views_range: string;
    engagement_range: string;
    top_post_url: string;
    willing_to_travel: boolean;
    audience_focus: string;
    top_audience_cities: string[];
    primary_audience_age: string;
    gender_skew: string;
    delivery_speed: string;
    revisions_ok: boolean;
    past_brand_collaborations: boolean;
}

export default function ProviderCreatorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [creator, setCreator] = useState<CreatorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    useEffect(() => {
        if (params.creatorId) {
            fetchCreator(params.creatorId as string);
        }
    }, [params.creatorId]);

    const fetchCreator = async (id: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("creator_profiles")
                .select("*")
                .eq("user_id", id) // Assumes creator_profiles.user_id matches the param ID (standard pattern)
                .single();

            if (error) throw error;
            setCreator(data as unknown as CreatorProfile);
        } catch (err) {
            console.error("Error fetching creator:", err);
            showToast("Could not load creator profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    const getPlatformIcon = (platform: string) => {
        const p = (platform || "").toLowerCase();
        if (p.includes("instagram")) return <Instagram className="w-4 h-4" />;
        if (p.includes("tiktok")) return <TikTokIcon className="w-4 h-4" />;
        if (p.includes("youtube")) return <Youtube className="w-4 h-4" />;
        return <Video className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
        );
    }

    if (!creator) return null;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
            </button>

            {/* Profile Header Card */}
            <div className="rounded-[3rem] bg-white border border-gray-100 p-8 md:p-12 shadow-sm relative overflow-hidden mb-8">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:items-start">
                    {/* Avatar Side */}
                    <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full border-4 border-white shadow-xl mb-4">
                            <ProfileImage
                                src={creator.avatar_url}
                                name={creator.display_name}
                                type="creator"
                                size="xl"
                                className="w-full h-full"
                            />
                        </div>
                        <div className="flex gap-2">
                            {/* Stats Badge */}
                            <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-gray-900">Top Rated</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Side */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-black text-gray-900">{creator.display_name}</h1>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                            {getPlatformIcon(creator.primary_platform)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 font-medium">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span>{creator.location_area || "Global"}</span>
                                        {creator.willing_to_travel && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold ml-2">Open to Travel</span>}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsRequestModalOpen(true)}
                                    className="flex-shrink-0 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:-translate-y-1 hover:bg-black transition-all flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Request
                                </button>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                                    {creator.primary_niche}
                                </span>
                                {creator.secondary_niches?.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-base text-gray-600 leading-relaxed font-medium max-w-3xl">
                            {creator.bio || "No bio available."}
                        </p>


                        {/* Key Stats Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                            <div className="p-4 rounded-2xl bg-gray-50 space-y-1 text-center md:text-left">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Followers</p>
                                <p className="text-lg font-black text-gray-900">{creator.follower_range}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 space-y-1 text-center md:text-left">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Avg Views</p>
                                <p className="text-lg font-black text-gray-900">{creator.avg_views_range}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 space-y-1 text-center md:text-left">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Engagement</p>
                                <p className="text-lg font-black text-gray-900">{creator.engagement_range}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 space-y-1 text-center md:text-left">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Delivery</p>
                                <p className="text-lg font-black text-gray-900">{creator.delivery_speed || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Audience & Location */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6">Audience & Reach</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm font-bold text-gray-500">Audience Focus</span>
                                <span className="text-sm font-black text-gray-900">{creator.audience_focus || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm font-bold text-gray-500">Primary Age Group</span>
                                <span className="text-sm font-black text-gray-900">{creator.primary_audience_age || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm font-bold text-gray-500">Gender Skew</span>
                                <span className="text-sm font-black text-gray-900">{creator.gender_skew || "N/A"}</span>
                            </div>
                            <div className="pt-2">
                                <span className="block text-sm font-bold text-gray-500 mb-3">Top Audience Cities</span>
                                <div className="flex flex-wrap gap-2">
                                    {(creator.top_audience_cities && creator.top_audience_cities.length > 0) ?
                                        creator.top_audience_cities.map(city => (
                                            <span key={city} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{city}</span>
                                        )) : <span className="text-sm text-gray-300 italic">No cities listed</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6">Service Areas</h3>
                        <div className="flex flex-wrap gap-2">
                            {(creator.service_areas && creator.service_areas.length > 0) ?
                                creator.service_areas.map(area => (
                                    <span key={area} className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-700">{area}</span>
                                )) : <span className="text-sm text-gray-300 italic">No specific areas listed</span>
                            }
                        </div>
                    </section>
                </div>

                {/* Right Column: Collaboration Style */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6">Content & Style</h3>
                        <div className="space-y-6">
                            <div>
                                <span className="block text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Content Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {creator.content_style_tags?.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg text-xs font-bold">#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <span className="block text-xs font-bold text-gray-400 mb-1">Active Platforms</span>
                                    <div className="flex gap-2 text-gray-900">
                                        {creator.active_platforms?.map(p => (
                                            <div key={p} title={p}>{getPlatformIcon(p)}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <span className="block text-xs font-bold text-gray-400 mb-1">Revisions</span>
                                    <span className="font-black text-sm text-gray-900">{creator.revisions_ok ? "Included" : "Upon Request"}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Request Modal */}
            <RequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                creator={{ id: creator.user_id, display_name: creator.display_name }}
            />
        </div>
    );
}
