"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User, LogOut, Settings, ChevronDown, UserCircle2, Sparkles, ClipboardCheck, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileImage from "@/components/ui/ProfileImage";

export default function CreatorHeader() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profile, setProfile] = useState<{ display_name: string | null; email: string | null; verified_balance: number; avatar_url: string | null } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("creator_profiles")
                .select("display_name, email, verified_balance, avatar_url")
                .eq("user_id", user.id)
                .single();

            if (data) {
                setProfile({
                    display_name: data.display_name,
                    email: data.email || user.email || null,
                    verified_balance: data.verified_balance || 0,
                    avatar_url: data.avatar_url
                });
            } else {
                setProfile({
                    display_name: null,
                    email: user.email || null,
                    verified_balance: 0,
                    avatar_url: null
                });
            }
        } catch (err) {
            console.error("Error fetching header profile:", err);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-12 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/creator/offers" className="flex items-center group">
                    <img
                        src="/logos/Connex2.png"
                        alt="Connex"
                        className="h-11 w-auto group-hover:scale-105 transition-transform"
                    />
                </Link>

                {/* Balance & Profile Area */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-64 flex items-center justify-between p-2 pr-4 rounded-2xl  hover:bg-gray-100 transition-colors group"
                        >
                            <div className="flex items-center gap-4 min-w-0 py-1 px-2">
                                <ProfileImage
                                    src={profile?.avatar_url}
                                    name={profile?.display_name || profile?.email}
                                    type="creator"
                                />
                                <div className="hidden md:block text-left min-w-0">
                                    <p className="text-m font-bold text-gray-900 leading-none truncate">
                                        {profile?.display_name || profile?.email || "Account"}
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
                                        href="/creator/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <User className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Edit Profile</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Verify your professional info</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/creator/applications"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <ClipboardCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-gray-900">Applications</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Track your pending offers</p>
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
