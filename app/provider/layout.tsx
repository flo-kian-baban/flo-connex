"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import DashboardShell, { NavItem } from "@/components/dashboard/layout/DashboardShell";
import { LayoutGrid, FileText, MessageSquare, Settings, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PROVIDER_NAV_ITEMS: NavItem[] = [
    { label: "Explore Creators", href: "/provider/explore", icon: Search },
    { label: "My Offers", href: "/provider/offers", icon: LayoutGrid },
    { label: "Applications", href: "/provider/applications", icon: FileText },
    { label: "Chats", href: "/chats", icon: MessageSquare },
    { label: "Settings", href: "/provider/settings", icon: Settings },
];

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/provider/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    {/* Reuse the same loader style as creator layout for consistency */}
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium italic">Loading workspace...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <AuthGuard>
            <DashboardShell
                role="provider"
                navItems={PROVIDER_NAV_ITEMS}
                profile={profile}
                userId={user?.id}
            >
                {children}
            </DashboardShell>
        </AuthGuard>
    );
}
