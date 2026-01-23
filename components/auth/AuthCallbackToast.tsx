"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/lib/toast-context";

export function AuthCallbackToast() {
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const authStatus = searchParams.get("auth");
        if (authStatus === "success") {
            showToast("Successfully signed in!", "success");

            // Clean up the URL parameter without refreshing
            const params = new URLSearchParams(searchParams.toString());
            params.delete("auth");
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, showToast, router, pathname]);

    return null;
}
