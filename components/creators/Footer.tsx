import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t pt-20 md:pt-28 pb-12 bg-gray-50/50 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 md:mb-28">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logos/Connex2.png"
                                alt="Connex"
                                width={120}
                                height={40}
                                className="w-30 h-auto object-contain"
                            />
                        </Link>
                        <p className="text-lg leading-relaxed max-w-xs text-gray-500">
                            The premier marketplace for connecting brands with top-tier content creators.
                        </p>
                        <div className="flex gap-6">
                            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                                <Icon
                                    key={i}
                                    size={24}
                                    className="hover:text-primary cursor-pointer transition-all hover:-translate-y-1 duration-300 text-gray-400"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-widest text-sm text-gray-900">Platform</h4>
                        <ul className="space-y-4 text-base font-medium text-gray-500">
                            {["Find Creators", "Find Jobs", "Pricing", "Case Studies"].map(link => (
                                <li key={link} className="hover:text-primary hover:translate-x-1 transition-all cursor-pointer inline-block w-full">{link}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-widest text-sm text-gray-900">Company</h4>
                        <ul className="space-y-4 text-base font-medium text-gray-500">
                            {["About Us", "Careers", "Blog", "Contact"].map(link => (
                                <li key={link} className="hover:text-primary hover:translate-x-1 transition-all cursor-pointer inline-block w-full">{link}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="font-bold mb-8 uppercase tracking-widest text-sm text-gray-900">Legal</h4>
                        <ul className="space-y-4 text-base font-medium text-gray-500">
                            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(link => (
                                <li key={link} className="hover:text-primary hover:translate-x-1 transition-all cursor-pointer inline-block w-full">{link}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-10 flex flex-col md:flex-row justify-between items-center text-sm font-medium tracking-wide border-gray-200/60 text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Connex Inc. All rights reserved.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Systems Operational
                        </span>
                        <span>Made with ❤️ in San Francisco</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
