"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    options: readonly Option[] | Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder,
    className = ""
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-16 pl-4 pr-10 rounded-2xl border transition-all outline-none flex items-center justify-between gap-2 overflow-hidden bg-white
                    ${isOpen ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100 hover:border-gray-200'}
                `}
            >
                <span className={`text-sm font-medium truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {/* Placeholder/All Option */}
                        <div
                            onClick={() => handleSelect("")}
                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between
                                ${value === "" ? 'text-primary bg-primary/5' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                        >
                            {placeholder}
                            {value === "" && <Check className="w-4 h-4" />}
                        </div>

                        {/* Options */}
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between
                                    ${value === option.value ? 'text-primary bg-primary/5' : 'text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                <span className="truncate pr-2">{option.label}</span>
                                {value === option.value && <Check className="w-4 h-4" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
