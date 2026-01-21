"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="w-full py-4 md:py-6 sticky top-0 z-50">
            <div className={`mx-auto px-4 transition-all duration-500 ease-in-out ${isScrolled ? 'max-w-xl' : 'max-w-2xl'}`}>
                {/* Liquid Glass Container */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-md flex items-center justify-between">

                    {/* Left: Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logos/Connex2.png"
                            alt="Connex"
                            width={36}
                            height={36}
                            className="w-20 h-18 object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Right: CTA */}
                    <Link
                        href="/auth/signup"
                        className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        Join as Creator
                    </Link>
                </div>
            </div>
        </nav>
    );
}
