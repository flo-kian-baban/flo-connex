"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Loader2, CheckCircle2, XCircle, Twitter, Instagram, Youtube, MapPin, MoreVertical, Clock, Building2, ChevronDown, MessageSquare, Check, X, ExternalLink, Play } from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";
import MediaPreview from "@/components/ui/MediaPreview";
import TikTokIcon from "@/components/ui/TikTokIcon";

interface Application {
    id: string;
    status: string;
    created_at: string;
    submitted_post_urls: string[] | null;
    submitted_deliverables: {
        label: string;
        url?: string;
        storage_path?: string;
        type?: 'video' | 'image'
    }[] | null;
    offer: {
        title: string;
    };
    creator: {
        display_name: string;
        email: string;
        primary_platform: string;
        follower_range: string;
        avg_views_range: string;
        engagement_range: string;
        location_area: string;
        niches: string[];
        avatar_url: string | null;
    }
}

export default function ProviderApplicationsPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOffers, setExpandedOffers] = useState<Record<string, boolean>>({});
    const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            const { data: provider } = await supabase
                .from("providers")
                .select("id")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (provider) {
                const { data, error } = await supabase
                    .from("applications")
                    .select(`
                        id,
                        status,
                        created_at,
                        submitted_post_urls,
                        submitted_deliverables,
                        offer:offers!inner(title, provider_id, cover_url, image_url),
                        creator:creator_profiles!inner(display_name, email, primary_platform, follower_range, avg_views_range, engagement_range, location_area, niches, avatar_url)`
                    )
                    .eq("offer.provider_id", provider.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                const apps = data as any || [];
                setApplications(apps);

                // Initialize all offers as expanded by default
                const offerTitles = Array.from(new Set(apps.map((a: any) => a.offer.title)));
                const initialExpanded: Record<string, boolean> = {};
                offerTitles.forEach(title => {
                    initialExpanded[title as string] = true;
                });
                setExpandedOffers(initialExpanded);
            }
        } catch (error: any) {
            console.error("Error fetching applications:", error.message || error);
            showToast("Failed to fetch applications", "error");
        } finally {
            setLoading(false);
        }
    };

    // Group applications by offer title
    const groupedApps = applications.reduce((acc, app) => {
        const title = app.offer.title;
        if (!acc[title]) acc[title] = [];
        acc[title].push(app);
        return acc;
    }, {} as Record<string, Application[]>);

    const toggleOffer = (title: string) => {
        setExpandedOffers(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const updateStatus = async (appId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("applications")
                .update({ status: newStatus })
                .eq("id", appId);

            if (error) throw error;

            setApplications(apps => apps.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));

            // Clean up notifications for this application (Action-Completed Cleanup)
            // If we acted on the application, we don't need reminders about it
            if (user?.id) {
                await supabase
                    .from('notifications')
                    .delete()
                    .eq('recipient_user_id', user.id)
                    .eq('application_id', appId);
            }
            showToast(`Application ${newStatus === 'accepted' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated'}`, "success");
        } catch (error) {
            console.error("Error updating status:", error);
            showToast("Failed to update status", "error");
        }
    };

    const toggleApplicationExpansion = (appId: string) => {
        setExpandedAppId(prev => prev === appId ? null : appId);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform?.toLowerCase()) {
            case 'instagram': return <Instagram className="w-3 h-3" />;
            case 'tiktok': return <TikTokIcon className="w-3 h-3" />;
            case 'youtube': return <Youtube className="w-3 h-3" />;
            default: return <span className="text-[10px] font-black">?</span>;
        }
    };

    return (
        <div className="space-y-8">
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
                <div className="space-y-6">
                    {Object.entries(groupedApps).map(([title, apps]) => {
                        // Extract cover image from the first app in the group (same offer)
                        // Casting to 'any' here as the Application interface might not fully reflect the deep partial join, 
                        // but we queried for it. Safest is to just access it.
                        const firstApp = apps[0] as any;
                        const coverImage = firstApp.offer.cover_url || firstApp.offer.image_url;

                        return (
                            <div key={title} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                {/* Offer Header Section (Unified with list) */}
                                <button
                                    onClick={() => toggleOffer(title)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50/30 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                                            {coverImage ? (
                                                <img
                                                    src={coverImage}
                                                    alt={title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{apps.length} {apps.length === 1 ? 'Application' : 'Applications'}</span>
                                                {expandedOffers[title] && <span className="w-1 h-1 rounded-full bg-primary/30" />}
                                                {expandedOffers[title] && <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Listing active</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-50 group-hover:text-gray-600 transition-all duration-300 ${expandedOffers[title] ? 'rotate-180 bg-gray-50' : ''}`}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </button>

                                {/* Section Content - Premium Height Animation */}
                                <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedOffers[title] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-0">
                                            <div className="h-px bg-gray-100/60 mb-8" />

                                            <div className="space-y-3">
                                                {/* Refined Header Row - 12-col grid for separate metrics */}
                                                <div className="hidden lg:grid grid-cols-12 gap-x-4 px-4 pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <div className="col-span-1"></div>
                                                    <div className="col-span-2">Creator</div>
                                                    <div className="col-span-1 text-center">Followers</div>
                                                    <div className="col-span-1 text-center">Avg Views</div>
                                                    <div className="col-span-1 text-center">Engagement</div>
                                                    <div className="col-span-2 text-center">Proof of Work</div>
                                                    <div className="col-span-2 text-center">Status</div>
                                                    <div className="col-span-2 text-right pr-4">Actions</div>
                                                </div>

                                                {apps.map((app) => (
                                                    <div key={app.id} className="relative">
                                                        <div className={`group/row relative z-10 bg-gray-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${expandedAppId === app.id
                                                            ? 'border-0 rounded-t-[2rem]'
                                                            : 'border-transparent hover:border-gray-200  hover:bg-gray-100 rounded-[2.5rem] bg-gray-50/60 mb-3 hover:-translate-y-0.5'
                                                            }`}>
                                                            <div className="grid grid-cols-12 gap-x-6 items-center p-6 sm:px-4 py-3">
                                                                {/* 1. Avatar */}
                                                                <div className="col-span-1 flex justify-center">
                                                                    <ProfileImage
                                                                        src={app.creator.avatar_url}
                                                                        name={app.creator.display_name}
                                                                        type="creator"
                                                                        className="w-14 h-14 ring-2 ring-white shadow-sm"
                                                                    />
                                                                </div>

                                                                {/* 2. Name */}
                                                                <div className="col-span-2 min-w-0">
                                                                    <p className="text-sm font-bold text-gray-900 truncate" title={app.creator.display_name}>{app.creator.display_name}</p>
                                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                                        <div className="w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 grayscale">
                                                                            {getPlatformIcon(app.creator.primary_platform)}
                                                                        </div>
                                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{app.creator.primary_platform}</span>
                                                                    </div>
                                                                </div>

                                                                {/* 3. Followers */}
                                                                <div className="col-span-1 flex flex-col items-center">
                                                                    <span className="text-sm font-black text-gray-900">{app.creator.follower_range}</span>
                                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Followers</span>
                                                                </div>

                                                                {/* 4. Avg Views */}
                                                                <div className="col-span-1 flex flex-col items-center">
                                                                    <span className="text-sm font-black text-gray-900">{app.creator.avg_views_range || "N/A"}</span>
                                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Avg Views</span>
                                                                </div>

                                                                {/* 5. Engagement */}
                                                                <div className="col-span-1 flex flex-col items-center">
                                                                    <span className="text-sm font-black text-primary">{app.creator.engagement_range || "0%"}</span>
                                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Eng.</span>
                                                                </div>

                                                                {/* 6. Proof of Work */}
                                                                <div className="col-span-2 flex justify-center px-2">
                                                                    {app.submitted_deliverables?.length || app.submitted_post_urls?.length ? (
                                                                        <button
                                                                            onClick={() => toggleApplicationExpansion(app.id)}
                                                                            className={`inline-flex items-center gap-1.5 text-[10px] px-4 py-2 rounded-full font-black transition-all shadow-sm border ${expandedAppId === app.id
                                                                                ? 'bg-primary text-white border-primary scale-105'
                                                                                : 'bg-white border-gray-100 text-primary hover:bg-primary/5'
                                                                                }`}
                                                                        >
                                                                            {expandedAppId === app.id ? (
                                                                                <>
                                                                                    <X className="w-3 h-3" />
                                                                                    CLOSE REVIEW
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Play className="w-3 h-3 fill-current" />
                                                                                    {(app.submitted_deliverables?.length || app.submitted_post_urls?.length || 0) > 1
                                                                                        ? `REVIEW ${app.submitted_deliverables?.length || app.submitted_post_urls?.length} LINKS`
                                                                                        : 'REVIEW SUBMISSION'}
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                                                                            Pending...
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* 7. Status */}
                                                                <div className="col-span-2 flex justify-center">
                                                                    <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border shadow-sm transition-all duration-300
                                                                    ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                            app.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                                app.status === 'completed' ? 'bg-primary/5 text-primary border-primary/10' :
                                                                                    app.status === 'pending' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                                                                        'bg-red-50 text-red-500 border-red-100'}
                                                                `}>
                                                                        {app.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> :
                                                                            app.status === 'in_progress' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                                                                app.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                                                                    app.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                                                        <XCircle className="w-3 h-3" />}
                                                                        {app.status === 'in_progress' ? 'In Progress' : app.status}
                                                                    </div>
                                                                </div>

                                                                {/* 8. Actions */}
                                                                <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                                                                    {app.status === 'pending' ? (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <button
                                                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                                                className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hover:-translate-y-1 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                                                                                title="Decline"
                                                                            >
                                                                                <XCircle className="w-5 h-5" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => updateStatus(app.id, 'in_progress')}
                                                                                className="h-9 px-4 rounded-full bg-gray-900 text-white hover:bg-primary hover:-translate-y-0.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md active:translate-y-0 active:scale-95"
                                                                            >
                                                                                Accept
                                                                            </button>
                                                                        </div>
                                                                    ) : app.status === 'completed' || app.status === 'in_progress' ? (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Link
                                                                                href={`/chats?applicationId=${app.id}`}
                                                                                className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:bg-primary/5 hover:text-primary hover:border-primary/20 hover:-translate-y-1 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                                                                                title="Message"
                                                                            >
                                                                                <MessageSquare className="w-4 h-4" />
                                                                            </Link>
                                                                            {app.status === 'completed' && (
                                                                                <button
                                                                                    onClick={() => updateStatus(app.id, 'accepted')}
                                                                                    className="h-9 px-4 rounded-full bg-gray-900 text-white hover:bg-primary hover:-translate-y-0.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md active:translate-y-0 active:scale-95"
                                                                                    title="Approve"
                                                                                >
                                                                                    Approve
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <button disabled className="w-9 h-9 rounded-full border border-gray-50 text-gray-200 flex items-center justify-center cursor-not-allowed bg-gray-50/50">
                                                                            <MoreVertical className="w-4 h-4 text-transparent" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Inline Expansion Area */}
                                                        <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedAppId === app.id ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                                                            <div className="overflow-hidden">
                                                                <div className="bg-gray-50 rounded-b-[2.5rem] border-primary/20 p-10 sm:px-16 sm:pb-12 pt-7 space-y-16 relative">
                                                                    {/* Premium Header Section
                                                                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-7 gap-6">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-2.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,77,34,0.4)]" />
                                                                                <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Reviewing Submission</h3>
                                                                            </div>
                                                                            <p className="text-3xl font-black text-gray-900 tracking-tight">
                                                                                {app.creator.display_name}’s Deliverables
                                                                            </p>
                                                                        </div>

                                                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                                                            <Link
                                                                                href={`/chats?applicationId=${app.id}`}
                                                                                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-6 py-3 bg-white text-gray-600 border border-gray-200 font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm hover:shadow group"
                                                                            >
                                                                                <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-gray-600" />
                                                                                Feedback
                                                                            </Link>
                                                                            <button
                                                                                onClick={() => {
                                                                                    updateStatus(app.id, 'accepted');
                                                                                    setExpandedAppId(null);
                                                                                }}
                                                                                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-8 py-3 bg-[#FF4D22] text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-[0_10px_20px_-5px_rgba(255,77,34,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,34,0.4)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 group"
                                                                            >
                                                                                <Check className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                                                Approve All
                                                                            </button>
                                                                        </div>
                                                                    </div>
 */}
                                                                    {/* Deliverables Grid */}
                                                                    {/* <div className={`grid gap-12 ${((app.submitted_deliverables?.length || 0) + (app.submitted_post_urls?.length || 0)) > 1
                                                                        ? 'grid-cols-1 md:grid-cols-2'
                                                                        : 'grid-cols-1 max-w-2xl mx-auto'
                                                                        }`}> */}
                                                                    <div className={"flex flex-row gap-14"}>
                                                                        {app.submitted_deliverables ? (
                                                                            app.submitted_deliverables.map((item, i) => (
                                                                                <div key={i} className="group/item flex flex-col items-start space-y-6">
                                                                                    {/* Item Header */}
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <span className="text-[14px] font-black w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover/item:bg-primary/5 group-hover/item:text-primary transition-colors">
                                                                                                {i + 1}
                                                                                            </span>
                                                                                            <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest group-hover/item:text-gray-600 transition-colors">{item.label}</span>
                                                                                        </div>
                                                                                        {/* {item.type && (
                                                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                                                                {item.type}
                                                                                            </span>
                                                                                        )} */}
                                                                                    </div>

                                                                                    {/* Media Container */}
                                                                                    <div className="relative">
                                                                                        {item.storage_path ? (
                                                                                            <MediaPreview
                                                                                                storagePath={item.storage_path}
                                                                                                type={item.type || 'image'}
                                                                                                applicationId={app.id}
                                                                                                maxHeight={((app.submitted_deliverables?.length || 0) + (app.submitted_post_urls?.length || 0)) > 1 ? "60vh" : "75vh"}
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="p-10 flex items-center justify-center min-h-[200px] bg-gray-50/50 rounded-3xl border border-gray-100">
                                                                                                <a
                                                                                                    href={item.url}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                    className="flex items-center justify-between w-full p-8 bg-white border border-gray-100 rounded-[2rem] group/link hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out shadow-sm"
                                                                                                >
                                                                                                    <div className="flex items-center gap-5 overflow-hidden">
                                                                                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover/link:bg-[#FF4D22]/5 transition-colors">
                                                                                                            <ExternalLink className="w-6 h-6 text-gray-400 group-hover/link:text-[#FF4D22] transition-colors" />
                                                                                                        </div>
                                                                                                        <div className="min-w-0 space-y-1">
                                                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">External Link</p>
                                                                                                            <p className="text-sm font-bold text-gray-900 truncate">{item.url}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full translate-x-2 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all">
                                                                                                        Open
                                                                                                    </div>
                                                                                                </a>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : null}

                                                                        {app.submitted_post_urls?.map((url: string, i: number) => (
                                                                            <div key={`url-${i}`} className="group/item flex flex-col space-y-6">
                                                                                <div className="flex items-center gap-3 px-2">
                                                                                    <span className="text-[12px] font-black w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                                                        {(app.submitted_deliverables?.length || 0) + i + 1}
                                                                                    </span>
                                                                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Post Link</span>
                                                                                </div>
                                                                                <div className="relative p-10 flex items-center justify-center min-h-[200px] bg-gray-50/50 rounded-3xl border border-gray-100">
                                                                                    <a
                                                                                        href={url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="flex items-center justify-between w-full p-8 bg-white border border-gray-100 rounded-[2rem] group/link hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out shadow-sm"
                                                                                    >
                                                                                        <div className="flex items-center gap-5 overflow-hidden">
                                                                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover/link:bg-[#FF4D22]/5 transition-colors">
                                                                                                <ExternalLink className="w-6 h-6 text-gray-400 group-hover/link:text-[#FF4D22] transition-colors" />
                                                                                            </div>
                                                                                            <div className="min-w-0 space-y-1">
                                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Content</p>
                                                                                                <p className="text-sm font-bold text-gray-900 truncate">{url}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full translate-x-2 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all">
                                                                                            Open
                                                                                        </div>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Inline Review Transitioned */}
        </div>
    );
}
