"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Calendar, CheckCircle2, XCircle, Clock, MapPin, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import ProfileImage from "@/components/ui/ProfileImage";

interface Application {
    id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    offer: {
        title: string;
        category: string;
        provider: {
            business_name: string;
            logo_url: string | null;
        }
    }
}

export default function CreatorApplicationsPage() {
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
            const { data, error } = await supabase
                .from("applications")
                .select(`
                    id,
                    status,
                    created_at,
                    offer:offers!inner(
                        title, 
                        category,
                        provider:providers!inner(business_name, logo_url)
                    )
                `)
                .eq("creator_id", user?.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setApplications(data as any || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-500 mt-1">Track the status of your offers</p>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        You haven't applied to any offers yet. Browse the marketplace to find collaborations.
                    </p>
                    <Link
                        href="/creator/offers"
                        className="inline-flex items-center justify-center px-6 py-3 mt-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Browse Offers
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Header Row (Optional, visuals usually suffice, but good for alignment) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-3">Provider</div>
                        <div className="col-span-4">Offer</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3 text-right">Applied Date</div>
                    </div>

                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group">
                            <div className="grid grid-cols-12 gap-4 items-center">

                                {/* 1. Provider Info */}
                                <div className="col-span-12 md:col-span-3 flex items-center gap-3 min-w-0">
                                    <ProfileImage
                                        src={app.offer.provider.logo_url}
                                        name={app.offer.provider.business_name}
                                        type="provider"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{app.offer.provider.business_name}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                            <Building2 className="w-3 h-3" />
                                            <span>Business</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Offer Info */}
                                <div className="col-span-12 md:col-span-4 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                                        {app.offer.title}
                                    </p>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 mt-1 uppercase tracking-wide">
                                        {app.offer.category}
                                    </span>
                                </div>

                                {/* 3. Status */}
                                <div className="col-span-6 md:col-span-2">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${app.status === 'accepted'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : app.status === 'rejected'
                                            ? 'bg-red-50 text-red-600 border-red-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {app.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        {app.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                        {app.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                        <span className="capitalize">{app.status}</span>
                                    </div>
                                </div>

                                {/* 4. Date */}
                                <div className="col-span-6 md:col-span-3 text-right">
                                    <p className="text-sm font-bold text-gray-900">{formatDate(app.created_at)}</p>
                                    <p className="text-xs text-gray-400 font-medium">Applied</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
