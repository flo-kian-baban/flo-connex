"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";

interface MultiSelectProps {
    options: readonly string[] | string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export default function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select areas..."
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const removeOption = (e: React.MouseEvent, option: string) => {
        e.stopPropagation();
        onChange(selected.filter(item => item !== option));
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex min-h-[52px] w-full cursor-pointer flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 transition-all hover:border-gray-200 ${isOpen ? "border-[#FF4D22]/20 bg-white ring-4 ring-[#FF4D22]/5" : ""
                    }`}
            >
                {selected.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {selected.map((option) => (
                            <span
                                key={option}
                                className="flex items-center gap-1 rounded-lg bg-[#FF4D22]/10 px-2 py-1 text-xs font-black text-[#FF4D22]"
                            >
                                {option}
                                <button
                                    onClick={(e) => removeOption(e, option)}
                                    className="rounded-full p-0.5 hover:bg-[#FF4D22]/20"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm font-semibold text-gray-400">{placeholder}</span>
                )}
                <div className="ml-auto pl-2 text-gray-400">
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl shadow-gray-200/50">
                    <div className="grid grid-cols-1 gap-1">
                        {options.map((option) => {
                            const isSelected = selected.includes(option);
                            return (
                                <div
                                    key={option}
                                    onClick={() => toggleOption(option)}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all hover:bg-gray-50 ${isSelected ? "bg-[#FF4D22]/5 text-[#FF4D22]" : "text-gray-600"
                                        }`}
                                >
                                    <span>{option}</span>
                                    {isSelected && <Check className="h-4 w-4" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
