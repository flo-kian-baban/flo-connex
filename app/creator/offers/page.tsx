"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OfferCard from "@/components/marketplace/OfferCard";
import FilterBar from "@/components/marketplace/FilterBar";
import { Loader2, Sparkles, Search } from "lucide-react";
import { GTA_LOCATIONS } from "@/lib/constants";

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [locationArea, setLocationArea] = useState("");
    const [exchangeType, setExchangeType] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchOffers(),
                fetchFavorites()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOffers = async () => {
        try {
            const { data, error } = await supabase
                .from("offers")
                .select("*, providers(business_name, logo_url)")
                .eq("status", "published")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOffers(data || []);
        } catch (err: any) {
            console.error("Error fetching offers:", err);
            setError(err.message);
        }
    };

    const fetchFavorites = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("favorites")
                .select("offer_id")
                .eq("creator_id", user.id);

            if (error) throw error;
            if (data) {
                setFavorites(new Set(data.map(f => f.offer_id)));
            }
        } catch (err) {
            console.error("Error fetching favorites:", err);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent, offerId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isFav = favorites.has(offerId);

        if (isFav) {
            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("creator_id", user.id)
                .eq("offer_id", offerId);

            if (!error) {
                const updated = new Set(favorites);
                updated.delete(offerId);
                setFavorites(updated);
            }
        } else {
            const { error } = await supabase
                .from("favorites")
                .insert({ creator_id: user.id, offer_id: offerId });

            if (!error) {
                const updated = new Set(favorites);
                updated.add(offerId);
                setFavorites(updated);
            }
        }
    };

    const categories = Array.from(new Set(offers.map((o) => o.category)));

    const filteredOffers = offers.filter((offer) => {
        const matchesSearch =
            offer.title.toLowerCase().includes(search.toLowerCase()) ||
            offer.providers.business_name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !category || offer.category === category;
        const matchesLocation = !locationArea || offer.location_area === locationArea;
        const matchesExchange = !exchangeType || offer.exchange_type === exchangeType;

        return matchesSearch && matchesCategory && matchesLocation && matchesExchange;
    });

    if (loading && offers.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-500 font-medium italic">Discovering exclusive offers for you...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Filter Area */}
            <FilterBar
                search={search} setSearch={setSearch}
                category={category} setCategory={setCategory}
                locationArea={locationArea} setLocationArea={setLocationArea}
                exchangeType={exchangeType} setExchangeType={setExchangeType}
                categories={categories}
                locations={GTA_LOCATIONS}
            />

            {/* Grid */}
            {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            isFavorite={favorites.has(offer.id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                    <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                        <p className="text-gray-500 text-sm">
                            Try adjusting your filters or search terms to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("");
                                setLocationArea("");
                                setExchangeType("");
                            }}
                            className="text-primary font-bold text-sm hover:underline"
                        >
                            Reset filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
