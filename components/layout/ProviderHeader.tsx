"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Settings, LayoutGrid, FileText, Building2, ChevronDown, ClipboardCheck, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProfileImage from "@/components/ui/ProfileImage";

export default function ProviderHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profile, setProfile] = useState<{ business_name: string | null; logo_url: string | null } | null>(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from("providers")
                .select("business_name, logo_url")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (data) {
                setProfile({
                    business_name: data.business_name,
                    logo_url: data.logo_url
                });
            }
        } catch (err) {
            console.error("Error fetching provider header profile:", err);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth/provider/login");
        router.refresh();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-12 h-20 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center">
                    <Link href="/provider/offers" className="flex items-center group">
                        <img
                            src="/logos/Connex2.png"
                            alt="Connex"
                            className="h-10 w-auto group-hover:scale-105 transition-transform"
                        />
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* <Link
                        href="/provider/offers/new"
                        className="hidden sm:inline-flex px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 items-center gap-2 border border-black"
                    >
                        <Building2 className="w-4 h-4" />
                        Create Offer
                    </Link> */}

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-64 flex items-center justify-between p-1 pr-4 rounded-2xl  hover:bg-gray-100 transition-colors group"
                        >
                            <div className="flex items-center gap-4 min-w-0 py-1 px-2">
                                <ProfileImage
                                    src={profile?.logo_url}
                                    name={profile?.business_name || user?.email}
                                    type="provider"
                                />
                                <div className="hidden md:block text-left min-w-0">
                                    <p className="text-m font-bold text-gray-900 leading-none truncate">
                                        {profile?.business_name || "Partner"}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-gray-400 shrink-0 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-gray-100 shadow-2xl p-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <Link
                                        href="/provider/settings"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Settings className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Settings</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Business profile & logo</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/provider/offers"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LayoutGrid className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-gray-900">My Offers</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Manage your listings</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/provider/applications"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FileText className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-gray-900">Applications</p>
                                            <p className="text-[10px] text-gray-400 font-medium">View pending requests</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/chats"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-gray-900">Chats</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Direct messages</p>
                                        </div>
                                    </Link>

                                    <div className="my-2 border-t border-gray-50" />

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LogOut className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-red-600">Sign Out</p>
                                            <p className="text-[10px] text-red-400/60 font-medium">End your session</p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
