import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-12 md:pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logos/Connex2.png"
                                alt="Connex"
                                width={32}
                                height={32}
                                className="w-20 h-16 object-contain"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The premier marketplace for connecting brands with top-tier content creators.
                        </p>
                        <div className="flex gap-4">
                            <Instagram size={20} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                            <Twitter size={20} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                            <Linkedin size={20} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                            <Facebook size={20} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-primary cursor-pointer">Find Creators</li>
                            <li className="hover:text-primary cursor-pointer">Find Jobs</li>
                            <li className="hover:text-primary cursor-pointer">Pricing</li>
                            <li className="hover:text-primary cursor-pointer">Case Studies</li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-primary cursor-pointer">About Us</li>
                            <li className="hover:text-primary cursor-pointer">Careers</li>
                            <li className="hover:text-primary cursor-pointer">Blog</li>
                            <li className="hover:text-primary cursor-pointer">Contact</li>
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-primary cursor-pointer">Terms of Service</li>
                            <li className="hover:text-primary cursor-pointer">Cookie Settings</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Connex Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Made with love in San Francisco</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
