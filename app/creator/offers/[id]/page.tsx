"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import {
    Loader2,
    ArrowLeft,
    MapPin,
    Tag,
    Globe,
    ExternalLink,
    ShieldCheck,
    Clock,
    Sparkles,
    CheckCircle2,
    Check,
    Image as ImageIcon,
    ListChecks,
    Instagram,
    Star
} from "lucide-react";
import Link from "next/link";
import ProfileImage from "@/components/ui/ProfileImage";

export default function OfferDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [profileStatus, setProfileStatus] = useState<string | null>(null);

    useEffect(() => {
        if (id && user) {
            fetchOfferDetails();
            checkApplicationStatus();
            fetchProfileStatus();
        }
    }, [id, user]);

    // Handle auto-apply if returning from profile setup
    useEffect(() => {
        if (searchParams.get('autoApply') === 'true' && profileStatus && profileStatus !== 'draft' && !applied && !applying) {
            handleApply();
        }
    }, [profileStatus, applied]);

    const fetchOfferDetails = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("offers")
                .select("*, providers(*)")
                .eq("id", id)
                .eq("status", "published")
                .single();

            if (error) throw error;
            setOffer(data);
        } catch (err) {
            console.error("Error fetching offer details:", err);
            showToast("This offer is currently not available.", "error");
            router.push("/creator/offers");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileStatus = async () => {
        const { data } = await supabase
            .from("creator_profiles")
            .select("status")
            .eq("user_id", user?.id)
            .single();

        setProfileStatus(data?.status || 'draft');
    };

    const checkApplicationStatus = async () => {
        const { data } = await supabase
            .from("applications")
            .select("id")
            .eq("offer_id", id)
            .eq("creator_id", user?.id)
            .single();

        if (data) setApplied(true);
    };

    const handleApply = async () => {
        if (!user) return;

        // Gating logic: Redirect if profile is incomplete
        if (!profileStatus || profileStatus === 'draft') {
            router.push(`/creator/profile?redirect=/creator/offers/${id}&autoApply=true`);
            return;
        }

        try {
            setApplying(true);
            const { error } = await supabase
                .from("applications")
                .insert({
                    offer_id: id,
                    creator_id: user.id,
                    status: 'pending'
                });

            if (error) throw error;
            setApplied(true);
        } catch (err) {
            console.error("Error applying:", err);
            alert("Failed to apply. Please try again.");
        } finally {
            setApplying(false);
        }
    };

    const [showStickyCTA, setShowStickyCTA] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const referenceElement = document.getElementById('offer-content-start');
            if (referenceElement) {
                const rect = referenceElement.getBoundingClientRect();
                setShowStickyCTA(rect.top < 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Google Reviews Fetching (Temporarily Disabled for OAuth Migration)
    const [reviews, setReviews] = useState<any[] | null>(null);
    const [ratingStats, setRatingStats] = useState<{ rating: number; total: number } | null>(null);

    // useEffect(() => {
    //     // OAuth implementation pending...
    // }, [offer]);

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!offer) return null;

    return (
        <div className="max-w-3xl mx-auto pb-20 px-4 sm:px-6 relative">
            {/* Sticky CTA Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-500 transform ${showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-3 md:p-4 flex items-center justify-between gap-4">
                    <div className="hidden md:flex items-center gap-3 pl-4">
                        <ProfileImage
                            src={offer.providers.logo_url}
                            name={offer.providers.business_name}
                            type="provider"
                            size="sm"
                        />
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Apply to</p>
                            <p className="text-sm font-bold text-gray-900 leading-none">{offer.title}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={applying || applied}
                        className={`flex-1 md:flex-none md:min-w-[200px] h-14 transition-all flex items-center justify-center gap-2 text-sm font-black rounded-2xl shadow-lg relative overflow-hidden ${applied
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
                            : "bg-primary hover:bg-primary-hover text-white active:scale-95"
                            }`}
                    >
                        {applying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : applied ? (
                            <>
                                <Check className="w-5 h-5" />
                                Applied
                            </>
                        ) : (
                            <>
                                Claim Now
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Back Button */}
            <div className="py-6">
                <Link
                    href="/creator/offers"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>
            </div>

            <div className="space-y-10">
                {/* Hero Header */}
                <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[40px] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                    {offer.cover_url ? (
                        <img
                            src={offer.cover_url}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                            <ImageIcon className="w-12 h-12 opacity-20" />
                        </div>
                    )}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-white/20 italic">
                            {offer.exchange_type === 'free' ? 'Free Experience' : offer.exchange_type === 'gifted' ? 'Gifted Item' : `${offer.discount_percentage}% Discount`}
                        </span>
                        <span className="px-4 py-1.5 bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm italic">
                            {offer.category}
                        </span>
                    </div>
                </div>

                {/* Offer Main Info Card */}
                <div id="offer-content-start" className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    {/* Status Banner */}
                    <div className="bg-orange-50/50 p-4 px-8 border-b border-orange-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Verified Connex Offer</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Added {new Date(offer.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {offer.title}
                        </h1>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                The Opportunity
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {offer.description}
                            </p>
                        </div>

                        {/* Deliverables */}
                        <div className="space-y-6 pt-8 border-t border-gray-50">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-primary" />
                                What's Expected
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {offer.deliverables && offer.deliverables.length > 0 ? (
                                    offer.deliverables.map((d: any, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100/50">
                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                <Instagram className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-900">{d.count}x {d.type}</p>
                                                <p className="text-xs text-gray-500 font-medium font-bold italic tracking-tight uppercase">Deliverable expectation</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                                        <p className="text-sm font-bold text-gray-400 italic">Expectations will be discussed during curation.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guidelines & Rules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Timeline</h4>
                                <div className="flex items-center gap-3 text-gray-900 font-bold">
                                    <Clock className="w-5 h-5 text-primary" />
                                    {offer.timeline || "To be discussed"}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Required Tags</h4>
                                <div className="flex items-center gap-3 text-gray-900 font-bold">
                                    <Tag className="w-5 h-5 text-primary" />
                                    {offer.required_tags || "None specified"}
                                </div>
                            </div>
                        </div>

                        {(offer.style_requirements || offer.restrictions) && (
                            <div className="space-y-6 pt-8 border-t border-gray-50">
                                {offer.style_requirements && (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Content Guidelines</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                            {offer.style_requirements}
                                        </p>
                                    </div>
                                )}
                                {offer.restrictions && (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Exclusions & Restrictions</h4>
                                        <p className="text-sm text-red-600/70 leading-relaxed font-bold italic">
                                            * {offer.restrictions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Provider Section & Reviews */}
                <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm space-y-10">
                    <div className="flex items-center justify-between gap-6 pb-8 border-b border-gray-50">
                        <div className="flex items-center gap-6">
                            <ProfileImage
                                src={offer.providers.logo_url}
                                name={offer.providers.business_name}
                                type="provider"
                                size="xl"
                            />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">The Brand</p>
                                <h4 className="text-3xl font-black text-gray-900 leading-tight">{offer.providers.business_name}</h4>
                                <div className="flex items-center gap-2 text-primary">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest italic">Verified Connex Partner</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-wrap gap-2">
                            {offer.providers.website && (
                                <a
                                    href={offer.providers.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 w-12 p-2 rounded-3xl bg-gray-50 text-gray-900 border border-gray-100 text-[10px] font-black flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    <Globe className="w-6 h-6" />
                                </a>
                            )}
                            {offer.providers.instagram_handle && (
                                <a
                                    href={`https://instagram.com/${offer.providers.instagram_handle.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 w-12 p-2 rounded-3xl bg-[#FF4D22]/5 text-primary border border-[#FF4D22]/10 text-[10px] font-black uppercase flex items-center justify-center hover:bg-[#FF4D22]/10 transition-colors shadow-sm"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Brand Essence</h4>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                {offer.providers.brand_description || `Professional service provider in the ${offer.providers.category} niche, dedicated to quality and creative collaboration.`}
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Key Details</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <span className="text-sm font-bold text-gray-500">Location</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {offer.providers.location_area || (offer.providers.service_areas && offer.providers.service_areas[0]) || "GTA"}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <span className="text-sm font-bold text-gray-500">Category</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <Tag className="w-4 h-4 text-primary" />
                                        {offer.providers.category || "Service Provider"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:hidden flex flex-wrap gap-3 pt-4 border-t border-gray-50">
                            {offer.providers.website && (
                                <a
                                    href={offer.providers.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 h-12 px-6 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    Website
                                </a>
                            )}
                            {offer.providers.instagram_handle && (
                                <a
                                    href={`https://instagram.com/${offer.providers.instagram_handle.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 h-12 px-6 rounded-2xl bg-[#FF4D22]/5 text-primary border border-[#FF4D22]/10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF4D22]/10 transition-colors"
                                >
                                    <Instagram className="w-4 h-4" />
                                    Instagram
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Google Reviews - Real Data from API */}
                    {reviews && reviews.length > 0 && (
                        <div className="pt-10 border-t border-gray-50 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Trust Signals</p>
                                    <h4 className="text-2xl font-black text-gray-900 leading-none">Google Reviews</h4>
                                </div>
                                {ratingStats && (
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end text-orange-400 mb-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-4 h-4 ${s <= Math.round(ratingStats.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">{ratingStats.rating} / 5.0 Rating</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {reviews.map((review: any, i: number) => (
                                    <div key={i} className="p-6 bg-gray-50/30 rounded-[32px] border border-gray-100/50 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-500/5 group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
                                                    {review.author_name ? review.author_name[0] : 'G'}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-gray-900 leading-none">{review.author_name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{review.relative_time_description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 text-orange-400">
                                                {Array.from({ length: 5 }).map((_, s) => (
                                                    <Star key={s} className={`w-3 h-3 ${s < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-4">
                                            "{review.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-60" />
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Verified Client Feedback</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
