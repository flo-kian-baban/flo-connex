"use client";

import { Search, ChevronDown, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";

interface FilterBarProps {
    search: string;
    setSearch: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    locationArea: string;
    setLocationArea: (val: string) => void;
    exchangeType: string;
    setExchangeType: (val: string) => void;
    categories: string[];
    locations: readonly string[];
}

export default function FilterBar({
    search, setSearch,
    category, setCategory,
    locationArea, setLocationArea,
    exchangeType, setExchangeType,
    categories, locations
}: FilterBarProps) {
    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setLocationArea("");
        setExchangeType("");
    };

    const hasActiveFilters = search || category || locationArea || exchangeType;

    return (
        <div className="space-y-4 mt-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search offers or brands..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-16 pl-12 pr-4 rounded-2xl border border-gray-100 bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                </div>

                {/* Custom Dropdown Filters */}
                <div className="flex flex-wrap gap-3">
                    <Dropdown
                        options={categories.map(cat => ({ label: cat, value: cat }))}
                        value={category}
                        onChange={setCategory}
                        placeholder="All Categories"
                        className="min-w-[180px]"
                    />

                    <Dropdown
                        options={locations.map(loc => ({ label: loc, value: loc }))}
                        value={locationArea}
                        onChange={setLocationArea}
                        placeholder="All Locations"
                        className="min-w-[180px]"
                    />

                    <Dropdown
                        options={[
                            { label: "Free Service", value: "free" },
                            { label: "Gifted Product", value: "gifted" },
                            { label: "Discount", value: "discount" },
                        ]}
                        value={exchangeType}
                        onChange={setExchangeType}
                        placeholder="All Exchange Types"
                        className="min-w-[200px]"
                    />

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="h-12 px-4 rounded-2xl border border-red-50 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-bold"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
