"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface NavbarProps {
    ctaText?: string;
    ctaLink?: string;
    logoLink?: string;
}

export default function Navbar({
    ctaText = "Join as Creator",
    ctaLink = "/auth/signup",
    logoLink = "/"
}: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="w-full fixed top-0 left-0 right-0 z-50 pointer-events-none py-6 md:py-8">
            <div className={`mx-auto px-4 md:px-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto ${isScrolled ? 'w-full md:max-w-xl' : 'w-full md:max-w-4xl'}`}>
                {/* Liquid Glass Container - Light Theme */}
                <div className={`backdrop-blur-xl border rounded-full px-4 md:px-4 py-3 md:py-4 shadow-2xl transition-all duration-500 flex items-center justify-between ${isScrolled
                    ? 'bg-white/80 border-gray-100 shadow-xl'
                    : 'bg-white/10 border-white/20 shadow-none'
                    }`}>

                    {/* Left: Brand */}
                    <Link href={logoLink} className="flex items-center gap-2 group">
                        <Image
                            src="/logos/Connex2.png"
                            alt="Connex"
                            width={100}
                            height={32}
                            className="w-28 h-auto ml-2 object-contain transition-all duration-500 group-hover:scale-105"
                        />
                    </Link>

                    {/* Right: CTA */}
                    <Link
                        href={ctaLink}
                        className="bg-primary hover:bg-primary-hover text-white text-[12px] md:text-[16px] font-bold px-6 md:px-10 py-3 md:py-3.5 rounded-full transition-all shadow-lg hover:shadow-primary/30 active:scale-95 whitespace-nowrap tracking-wide"
                    >
                        {ctaText}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
