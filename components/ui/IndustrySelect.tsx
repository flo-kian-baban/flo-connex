"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, Plus } from "lucide-react";

interface IndustrySelectProps {
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
}

const DEFAULT_INDUSTRIES = [
    "Dental",
    "Skincare",
    "Fitness",
    "Beauty",
    "Automotive",
    "Restaurants",
    "Education",
    "Real Estate",
    "Health & Wellness",
    "Fashion",
    "Technology",
    "Legal",
    "Financial Services",
    "Medical",
    "E-commerce",
    "Hospitality",
    "Entertainment"
];

export default function IndustrySelect({
    value,
    onChange,
    placeholder = "Search or select industry..."
}: IndustrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredIndustries = DEFAULT_INDUSTRIES.filter(industry =>
        industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isCustomValue = searchTerm && !filteredIndustries.some(i => i.toLowerCase() === searchTerm.toLowerCase());

    const handleSelect = (industry: string) => {
        onChange(industry);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex min-h-[52px] w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition-all hover:border-gray-200 ${isOpen ? "border-[#FF4D22]/20 bg-white ring-4 ring-[#FF4D22]/5" : ""
                    }`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {value ? (
                        <span className="text-sm font-bold text-gray-900 truncate">{value}</span>
                    ) : (
                        <span className="text-sm font-semibold text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
                    <div className="p-2 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && isCustomValue) {
                                        handleSelect(searchTerm);
                                    }
                                }}
                                className="w-full rounded-xl border-none bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400 focus:bg-gray-100/50"
                                placeholder="Type to filter..."
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-52 overflow-y-auto p-1">
                        {filteredIndustries.length > 0 ? (
                            filteredIndustries.map((industry) => (
                                <div
                                    key={industry}
                                    onClick={() => handleSelect(industry)}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all hover:bg-gray-50 ${value === industry ? "bg-[#FF4D22]/5 text-[#FF4D22]" : "text-gray-600"
                                        }`}
                                >
                                    <span>{industry}</span>
                                    {value === industry && <Check className="h-4 w-4" />}
                                </div>
                            ))
                        ) : !isCustomValue && (
                            <div className="px-3 py-4 text-center">
                                <p className="text-xs font-bold text-gray-400">No industries found</p>
                            </div>
                        )}

                        {isCustomValue && (
                            <div
                                onClick={() => handleSelect(searchTerm)}
                                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-[#FF4D22] transition-all hover:bg-[#FF4D22]/5"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add custom: "{searchTerm}"</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
