"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            // 1. Not logged in
            if (!user) {
                if (pathname?.startsWith("/provider")) {
                    router.push("/auth/provider/login");
                } else {
                    router.push("/auth/login");
                }
                return;
            }

            // 2. Logged in, check Role for Provider routes
            if (pathname?.startsWith("/provider")) {
                const role = user.user_metadata?.role;
                if (role !== 'provider') {
                    // Start strict: Redirect to creator area or logout
                    // For now, redirect to creator offers to avoid blocking them if they are just lost
                    router.push("/creator/offers");
                }
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
