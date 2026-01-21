"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Eye, MoreHorizontal, Filter, Search as SearchIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import ProfileImage from "@/components/ui/ProfileImage";

export default function ProviderOffersPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [offers, setOffers] = useState<any[]>([]);
    const [providerLogo, setProviderLogo] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchOffers();
        }
    }, [user]);

    const fetchOffers = async () => {
        try {
            // First get the provider ID
            const { data: provider } = await supabase
                .from("providers")
                .select("id, logo_url")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (provider) {
                setProviderLogo(provider.logo_url);
                const { data, error } = await supabase
                    .from("offers")
                    .select("*")
                    .eq("provider_id", provider.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setOffers(data || []);
            }
        } catch (error) {
            console.error("Error fetching offers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (offerId: string, coverUrl: string | null) => {
        if (!confirm("Are you sure you want to delete this offer? This cannot be undone.")) return;

        setDeletingId(offerId);
        try {
            // 1. Delete from storage if cover exists
            if (coverUrl && coverUrl.includes('offer-covers')) {
                try {
                    const filePath = coverUrl.split('offer-covers/')[1];
                    if (filePath) {
                        await supabase.storage.from('offer-covers').remove([filePath]);
                    }
                } catch (storageError) {
                    console.error("Error deleting cover from storage:", storageError);
                    // Continue with DB deletion even if storage fails
                }
            }

            // 2. Delete from database
            const { error } = await supabase
                .from("offers")
                .delete()
                .eq("id", offerId);

            if (error) throw error;

            // 3. Update UI
            setOffers(prev => prev.filter(o => o.id !== offerId));
            showToast("Offer deleted successfully!", "success");
        } catch (error: any) {
            console.error("Error deleting offer:", error);
            showToast(error.message || "Failed to delete offer.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-center ">
                <Link
                    href="/provider/offers/new"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-10 text-m font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Create New Offer
                </Link>
            </div>

            {/* List */}
            {loading ? (
                <div className="py-20 text-center">Loading offers...</div>
            ) : offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                        <Filter className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No offers yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        Create your first offer to start receiving applications from creators.
                    </p>
                    <Link
                        href="/provider/offers/new"
                        className="text-primary font-bold hover:underline"
                    >
                        Create your first offer
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-3xl bg-white border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                    {offer.cover_url ? (
                                        <img src={offer.cover_url} alt={offer.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold text-[10px] uppercase text-center p-2">No Image</div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border
                                            ${offer.status === 'published'
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                            }`}
                                        >
                                            {offer.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                                        <span>{offer.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="capitalize">{offer.exchange_type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-100">
                                <Link
                                    href={`/provider/offers/${offer.id}`}
                                    className="flex-1 md:flex-none h-10 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(offer.id, offer.cover_url)}
                                    disabled={deletingId === offer.id}
                                    className="h-10 w-10 rounded-xl border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                    {deletingId === offer.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
