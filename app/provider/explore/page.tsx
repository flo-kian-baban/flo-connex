"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Search, Filter } from "lucide-react";
import CreatorCard from "@/components/dashboard/explore/CreatorCard";
import Dropdown from "@/components/ui/Dropdown";
import { NICHES, PLATFORMS, GTA_LOCATIONS } from "@/lib/constants";

interface CreatorProfile {
    id: string; // user_id
    user_id?: string; // fallback if id field doesn't exist
    display_name: string;
    avatar_url: string | null;
    primary_niche: string;
    content_style_tags: string[];
    location_area: string;
    primary_platform: string;
    follower_range: string;
    avg_views_range: string;
    engagement_range: string;
}

export default function ProviderExplorePage() {
    const [creators, setCreators] = useState<CreatorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Filters
    const [selectedNiche, setSelectedNiche] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");

    useEffect(() => {
        fetchCreators();
    }, []);

    const fetchCreators = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("creator_profiles")
                .select("*")
                .neq("display_name", null) // Show all profiles with a name, ignoring status for now
                .limit(50);

            if (error) throw error;
            if (data) setCreators(data as unknown as CreatorProfile[]);
        } catch (err) {
            console.error("Error fetching creators:", err);
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtering for responsiveness
    // (For large datasets, move to server-side query params)
    const filteredCreators = creators.filter(creator => {
        const matchesSearch =
            creator.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creator.primary_niche?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            false;

        const matchesNiche = !selectedNiche || creator.primary_niche === selectedNiche;
        const matchesLocation = !selectedLocation || creator.location_area === selectedLocation;
        const matchesPlatform = !selectedPlatform || creator.primary_platform === selectedPlatform;

        return matchesSearch && matchesNiche && matchesLocation && matchesPlatform;
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">
                        Explore Creators
                    </h1>
                    <p className="mt-2 text-base text-gray-500 max-w-xl">
                        Discover top-performing creators in the GTA for your next campaign.
                    </p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="mb-10 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm border border-gray-100 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or niche..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 w-full rounded-2xl bg-gray-50 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary/10"
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="w-full sm:w-48">
                        <Dropdown
                            options={[{ label: "All Niches", value: "" }, ...NICHES.map(n => ({ label: n, value: n }))]}
                            value={selectedNiche}
                            onChange={(val) => setSelectedNiche(val)}
                            placeholder="Niche"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Dropdown
                            options={[{ label: "All Locations", value: "" }, ...GTA_LOCATIONS.map(l => ({ label: l, value: l }))]}
                            value={selectedLocation}
                            onChange={(val) => setSelectedLocation(val)}
                            placeholder="Location"
                        />
                    </div>
                    <div className="w-full sm:w-40">
                        <Dropdown
                            options={[{ label: "All Platforms", value: "" }, ...PLATFORMS.map(p => ({ label: p, value: p }))]}
                            value={selectedPlatform}
                            onChange={(val) => setSelectedPlatform(val)}
                            placeholder="Platform"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                </div>
            ) : filteredCreators.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCreators.map((creator) => (
                        <CreatorCard key={creator.id || creator.user_id} creator={{ ...creator, id: creator.id || creator.user_id || "" }} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-gray-200 bg-gray-50/50 py-24 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <Filter className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No creators found</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Try adjusting your filters or search terms to find who you're looking for.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedNiche("");
                            setSelectedLocation("");
                            setSelectedPlatform("");
                        }}
                        className="mt-6 text-sm font-bold text-primary hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
