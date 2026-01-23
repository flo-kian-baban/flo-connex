
"use client";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
}

export default function Toggle({
    checked,
    onChange,
    label,
    description
}: ToggleProps) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
                {label && <div className="text-sm font-bold text-gray-900">{label}</div>}
                {description && <div className="text-[12px] text-gray-400 font-medium">{description}</div>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 ${checked ? 'bg-primary' : 'bg-gray-200'
                    }`}
            >
                <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
}
