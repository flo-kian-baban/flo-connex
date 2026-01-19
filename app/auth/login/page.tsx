"use client";

import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {/* Back to Home */}
            <div className="absolute top-8 left-8 hidden md:block">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
                >
                    <MoveLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <div className="w-full text-center mb-8 md:hidden">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 text-sm"
                >
                    <MoveLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <AuthForm type="login" />

            <div className="mt-8 text-center text-sm text-gray-400">
                &copy; 2024 Connex. All rights reserved.
            </div>
        </main>
    );
}
