"use client";

import Link from "next/link";
import { MapPin, Tag, Heart } from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";

interface OfferCardProps {
    offer: {
        id: string;
        title: string;
        category: string;
        city: string;
        location_area: string;
        image_url: string | null;
        cover_url?: string | null;
        exchange_type: "free" | "discount" | "gifted" | string;
        discount_percent: number | null;
        providers: {
            business_name: string;
            logo_url: string | null;
        };
    };
    isFavorite?: boolean;
    onToggleFavorite?: (e: React.MouseEvent, offerId: string) => void;
}

export default function OfferCard({
    offer,
    isFavorite = false,
    onToggleFavorite
}: OfferCardProps) {
    const getOfferImage = () => {
        if (offer.cover_url) return offer.cover_url;
        if (offer.image_url) return offer.image_url;

        const text = `${offer.title} ${offer.category}`.toLowerCase();

        // Mapping categories/keywords to high-quality Unsplash images
        if (text.includes("dental") || text.includes("teeth") || text.includes("smile")) {
            return "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000"; // Modern dental office
        }
        if (text.includes("skincare") || text.includes("facial") || text.includes("beauty") || text.includes("spa")) {
            return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000"; // Premium skincare/spa
        }
        if (text.includes("fitness") || text.includes("gym") || text.includes("workout") || text.includes("yoga")) {
            return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000"; // Modern gym
        }
        if (text.includes("auto") || text.includes("car") || text.includes("detailing") || text.includes("wash")) {
            return "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000"; // Luxury car/detailing
        }
        if (text.includes("food") || text.includes("restaurant") || text.includes("dining") || text.includes("cafe")) {
            return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000"; // Artistic food shot
        }
        if (text.includes("tech") || text.includes("gaming") || text.includes("software") || text.includes("app")) {
            return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000"; // Clean tech setup
        }
        if (text.includes("fashion") || text.includes("clothing") || text.includes("style") || text.includes("boutique")) {
            return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000"; // Premium boutique
        }
        if (text.includes("home") || text.includes("decor") || text.includes("interior") || text.includes("furniture")) {
            return "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000"; // Modern interior
        }

        // Generic premium fallback
        return "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"; // Minimal aesthetic workspace
    };

    const exchangeLabel = {
        free: "Free Service",
        discount: `${offer.discount_percent}% Discount`,
        gifted: "Gifted Product",
    };

    const exchangeColors = {
        free: "bg-emerald-50 text-emerald-600 border-emerald-100",
        discount: "bg-blue-50 text-blue-600 border-blue-100",
        gifted: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <Link
            href={`/creator/offers/${offer.id}`}
            className="group bg-white rounded-[2.5rem] border border-gray-100 px-4 pt-4 pb-1.5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full bg-clip-border"
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full mb-6 overflow-hidden rounded-[2rem]">
                <img
                    src={getOfferImage()}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Heart Button */}
                <button
                    onClick={(e) => onToggleFavorite?.(e, offer.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10 group/heart"
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-gray-400 group-hover/heart:text-primary'}`}
                    />
                </button>

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md bg-white/90 shadow-sm ${exchangeColors[offer.exchange_type as keyof typeof exchangeColors] || exchangeColors.free}`}>
                        {exchangeLabel[offer.exchange_type as keyof typeof exchangeLabel] || offer.exchange_type}
                    </span>
                </div>
            </div>

            {/* Content Header: Logo + Business Name */}
            <div className="px-2 flex items-center gap-3 mb-4">
                <ProfileImage
                    src={offer.providers.logo_url}
                    name={offer.providers.business_name}
                    type="provider"
                    size="lg"
                />
                <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-widest text-black leading-none mb-1">Partner</p>
                    <h4 className="text-sm font-bold text-gray-600 truncate pr-2">
                        {offer.providers.business_name}
                    </h4>
                </div>
            </div>

            {/* Title & Metadata Area */}
            <div className="px-2 mb-4 space-y-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors truncate leading-tight pb-2">
                    {offer.title}
                </h3>

                {/* Secondary Metadata: Location (Left) | Niche (Right) */}
                <div className="flex items-center pt-4 border-t border-gray-100/80">
                    <div className="flex-1 flex items-center gap-1.5 truncate pr-2">
                        <MapPin className="w-4 h-4 text-primary/80 shrink-0" />
                        <span className="text-s font-medium text-gray-400 lowercase truncate">
                            {offer.location_area}
                        </span>
                    </div>


                    <div className="flex-1 flex justify-end truncate pl-2">
                        <span className="px-2.5 py-1 border border-gray-100 rounded-md text-xs font-bold uppercase tracking-widest text-gray-900 bg-gray-50/50">
                            {offer.category}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
