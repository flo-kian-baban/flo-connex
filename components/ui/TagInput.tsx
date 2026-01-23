
"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    suggestions?: readonly string[];
    placeholder?: string;
    maxTags?: number;
    allowNew?: boolean;
    label?: string;
    description?: string;
    className?: string;
}

export default function TagInput({
    value,
    onChange,
    suggestions = [],
    placeholder = "Type to add...",
    maxTags = 5,
    allowNew = true,
    label,
    description,
    className
}: TagInputProps) {
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(s =>
        s.toLowerCase().includes(search.toLowerCase()) &&
        !value.includes(s)
    );

    const normalizeTag = (val: string) => {
        return val.trim();
    };

    const addTag = (tag: string) => {
        const normalized = normalizeTag(tag);
        if (!normalized) return;

        if (maxTags === 1) {
            // Single select mode: replace existing
            onChange([normalized]);
            setSearch("");
            setShowSuggestions(false);
        } else {
            // Multi select mode
            if (value.length < maxTags && !value.includes(normalized)) {
                onChange([...value, normalized]);
                setSearch("");
                setShowSuggestions(false);
            }
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter(t => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !search && value.length > 0) {
            removeTag(value[value.length - 1]);
        } else if ((e.key === 'Enter' || e.key === ',') && search) {
            e.preventDefault();
            if (allowNew || suggestions.includes(search)) {
                addTag(search);
            }
        }
    };

    return (
        <div className="space-y-4">
            {label && (
                <label className={className || "text-s font-black uppercase tracking-wide text-black flex items-center gap-3"}>
                    {/* Icon could be passed if needed */}
                    {label}
                </label>
            )}

            <div className="relative">
                <div
                    className="min-h-[72px] w-full p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all outline-none"
                    onClick={() => document.getElementById(`tag-input-${label}`)?.focus()}
                >
                    {value.map(tag => (
                        <span
                            key={tag}
                            className="h-10 pl-4 pr-2 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-900 group/pill"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                                className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center text-gray-300"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {value.length < maxTags && (
                        <input
                            id={`tag-input-${label}`}
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder={value.length === 0 ? placeholder : ""}
                            className="flex-1 min-w-[120px] h-10 bg-transparent border-none outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                        />
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && search && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredSuggestions.map(suggestion => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors text-sm font-bold flex items-center justify-between group"
                            >
                                {suggestion}
                                <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {description && <p className="text-[12px] text-gray-400 font-medium ml-1">{description}</p>}
        </div>
    );
}
