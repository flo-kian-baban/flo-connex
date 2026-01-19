"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, CheckCircle2, XCircle, Twitter, Instagram, Youtube, MapPin } from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";

interface Application {
    id: string;
    status: string;
    created_at: string;
    offer: {
        title: string;
    };
    creator: {
        display_name: string;
        email: string;
        primary_platform: string;
        follower_range: string;
        engagement_range: string;
        location_area: string;
        niches: string[];
        avatar_url: string | null;
    }
}

export default function ProviderApplicationsPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            // Get Provider ID
            const { data: provider } = await supabase
                .from("providers")
                .select("id")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (provider) {
                // Fetch applications for offers owned by this provider
                const { data, error } = await supabase
                    .from("applications")
                    .select(`
                        id,
                        status,
                        created_at,
                        offer:offers!inner(title, provider_id),
                        creator:creator_profiles!inner(display_name, email, primary_platform, follower_range, engagement_range, location_area, niches, avatar_url)
                    `)
                    .eq("offer.provider_id", provider.id) // Filter by provider via relation
                    .order("created_at", { ascending: false });

                if (error) throw error;
                // Supabase types are tricky with inner joins, casting broadly here for MVP
                setApplications(data as any || []);
            }
        } catch (error: any) {
            console.error("Error fetching applications:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("applications")
                .update({ status: newStatus })
                .eq("id", appId);

            if (error) throw error;

            // Optimistic update
            setApplications(apps => apps.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform?.toLowerCase()) {
            case 'instagram': return <Instagram className="w-3 h-3" />;
            case 'tiktok': return <span className="text-[10px] font-black">TT</span>;
            case 'youtube': return <Youtube className="w-3 h-3" />;
            default: return <span className="text-[10px] font-black">?</span>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Applications</h1>
                    <p className="text-gray-500 font-medium">Review and manage creator requests.</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-gray-100 p-12 text-center shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Once creators apply to your published offers, they will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                {/* 1. Avatar */}
                                <div className="col-span-1 flex justify-center">
                                    <ProfileImage
                                        src={app.creator.avatar_url}
                                        name={app.creator.display_name}
                                        type="creator"
                                    />
                                </div>

                                {/* 2. Name */}
                                <div className="col-span-2 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Creator</p>
                                    <p className="text-sm font-bold text-gray-900 truncate" title={app.creator.display_name}>{app.creator.display_name}</p>
                                </div>

                                {/* 3. Applied To */}
                                <div className="col-span-2 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Offer</p>
                                    <p className="text-sm font-bold text-gray-900 truncate" title={app.offer.title}>{app.offer.title}</p>
                                </div>

                                {/* 4. Platform */}
                                <div className="col-span-2 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Platform</p>
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                        <div className="w-4 h-4 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-600">
                                            {getPlatformIcon(app.creator.primary_platform)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 capitalize truncate">{app.creator.primary_platform}</span>
                                    </div>
                                </div>

                                {/* 5. Stats */}
                                <div className="col-span-2 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Reach & Eng.</p>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 truncate">{app.creator.follower_range}</span>
                                        <span className="text-xs font-medium text-gray-500 truncate">{app.creator.engagement_range || "N/A"} Eng.</span>
                                    </div>
                                </div>

                                {/* 6. Niches */}
                                <div className="col-span-2 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Niches</p>
                                    <div className="flex items-center gap-1 flex-wrap h-6 overflow-hidden">
                                        {app.creator.niches?.slice(0, 2).map(niche => (
                                            <span key={niche} className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 truncate max-w-[80px]">
                                                {niche}
                                            </span>
                                        ))}
                                        {app.creator.niches?.length > 2 && (
                                            <span className="text-[10px] font-bold text-gray-400">+{app.creator.niches.length - 2}</span>
                                        )}
                                    </div>
                                </div>

                                {/* 7. Actions */}
                                <div className="col-span-1 flex items-center justify-end gap-2">
                                    {app.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 flex items-center justify-center transition-all"
                                                title="Decline"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'accepted')}
                                                className="w-8 h-8 rounded-lg bg-gray-900 text-white hover:bg-primary border border-transparent flex items-center justify-center transition-all shadow-sm"
                                                title="Accept"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5
                                            ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
                                        `}>
                                            {app.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
