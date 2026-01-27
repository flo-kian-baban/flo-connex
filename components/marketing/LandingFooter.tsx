"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Linkedin } from "lucide-react";

interface LandingFooterProps {
    mode: "creator" | "business";
}

export default function LandingFooter({ mode }: LandingFooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Image
                                src="/logos/Connex2.png"
                                alt="Connex"
                                width={32}
                                height={32}
                                className="w-auto h-8"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            The professional platform for high-value creator-business collaborations.
                            Quality over quantity.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/creators" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    For Creators
                                </Link>
                            </li>
                            <li>
                                <Link href="/business" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    For Business
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    Log In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/about" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/terms" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-500 hover:text-primary transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        &copy; {currentYear} Connex. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
