"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Compass, ClipboardCheck, MessageSquare, User } from "lucide-react";
import DashboardShell, { NavItem } from "@/components/dashboard/layout/DashboardShell";
import { supabase } from "@/lib/supabase";
import { AuthCallbackToast } from "@/components/auth/AuthCallbackToast";

const CREATOR_NAV_ITEMS: NavItem[] = [
    { label: "Explore", href: "/creator/offers", icon: Compass },
    { label: "Applications", href: "/creator/applications", icon: ClipboardCheck },
    { label: "Chats", href: "/chats", icon: MessageSquare },
    { label: "Profile", href: "/creator/profile", icon: User },
];

export default function CreatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-400 font-medium italic">Preparing your experience...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <DashboardShell
            role="creator"
            navItems={CREATOR_NAV_ITEMS}
            profile={profile}
            userId={user?.id}
        >
            <AuthCallbackToast />
            {children}
        </DashboardShell>
    );
}
