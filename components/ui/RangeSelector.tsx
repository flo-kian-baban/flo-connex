"use client";

interface Option {
    label: string;
    value: string;
}

interface RangeSelectorProps {
    options: readonly Option[] | Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export default function RangeSelector({
    options,
    value,
    onChange,
    label
}: RangeSelectorProps) {
    const currentIndex = options.findIndex(opt => opt.value === value);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const percentage = (safeIndex / (options.length - 1)) * 100;

    return (
        <div className="space-y-2 py-4">
            <div className="flex items-center justify-between gap-4">
                {label && (
                    <label className="text-s font-black uppercase tracking-widest text-black">
                        {label}
                    </label>
                )}
                <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest rounded-lg border border-primary/10 ">
                    {options[safeIndex]?.label}
                </span>
            </div>

            <div className="relative h-12 flex items-center group">
                {/* Track Background */}
                <div className="absolute w-full h-2 bg-gray-100 rounded-full" />

                {/* Active Track Fill */}
                <div
                    className="absolute h-2 bg-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />

                {/* Snap Pips */}
                <div className="absolute w-full flex justify-between px-1">
                    {options.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 h-1 rounded-full transition-colors duration-300 ${i <= safeIndex ? 'bg-primary/20' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>

                {/* Range Input (Invisible Controller) */}
                <input
                    type="range"
                    min="0"
                    max={options.length - 1}
                    value={safeIndex}
                    onChange={(e) => onChange(options[parseInt(e.target.value)].value)}
                    className="absolute w-full h-12 opacity-0 cursor-pointer z-10"
                />

                {/* Custom Thumb */}
                <div
                    className="absolute w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg shadow-primary/20 transition-all duration-300 ease-out pointer-events-none z-0 hover:scale-110"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                />
            </div>

            {/* Labels - Show min/max for clarity */}
            <div className="flex justify-between px-1">
                <span className="text-[15px] font-bold text-gray-300 uppercase tracking-tighter">{options[0].label}</span>
                <span className="text-[15px] font-bold text-gray-300 uppercase tracking-tighter">{options[options.length - 1].label}</span>
            </div>
        </div>
    );
}
