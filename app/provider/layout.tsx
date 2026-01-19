"use client";

import ProviderHeader from "@/components/layout/ProviderHeader";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 pt-20">
                <ProviderHeader />
                <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
