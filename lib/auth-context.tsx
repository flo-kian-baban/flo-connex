"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface UserProfile {
    name: string | null;
    image: string | null;
    email?: string | null;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userType: 'provider' | 'creator' | null;
    profile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: (role?: 'provider' | 'creator') => Promise<void>;
    signInWithFacebook: (role?: 'provider' | 'creator') => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    userType: null,
    profile: null,
    loading: true,
    signInWithGoogle: async (_role?: 'provider' | 'creator') => { },
    signInWithFacebook: async (_role?: 'provider' | 'creator') => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userType, setUserType] = useState<'provider' | 'creator' | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Unified profile fetcher
    const fetchProfile = useCallback(async (currentUser: User, role: 'provider' | 'creator' | null) => {
        if (!currentUser || !role) return null;

        // 1. Optimistic Update (Immediate)
        // Try to get what we can from metadata to resolve UI immediately
        const metadataName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;
        const metadataAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
        const optimisticProfile = {
            name: metadataName || currentUser.email?.split('@')[0] || "User",
            image: metadataAvatar || null,
            email: currentUser.email
        };

        // If we don't have a profile yet, set the optimistic one to prevent "flicker"
        setProfile(prev => prev || optimisticProfile);

        try {
            // 2. Database Fetch (Background)
            let dbData = null;
            if (role === 'provider') {
                const { data } = await supabase
                    .from("providers")
                    .select("business_name, logo_url")
                    .eq("claimed_by_user_id", currentUser.id)
                    .single();

                if (data && data.business_name) {
                    dbData = { name: data.business_name, image: data.logo_url, email: currentUser.email };
                }
            } else if (role === 'creator') {
                const { data } = await supabase
                    .from("creator_profiles")
                    .select("display_name, avatar_url, email")
                    .eq("user_id", currentUser.id)
                    .single();

                if (data && data.display_name) {
                    dbData = { name: data.display_name, image: data.avatar_url, email: data.email || currentUser.email };
                }
            }

            // Only update if DB gave us something better
            if (dbData) {
                setProfile(dbData);
            } else {
                // If DB failed/empty, keep fallback but ensure consistency
                setProfile(optimisticProfile);
            }
        } catch (error) {
            // Silent fail, keep optimistic
        }
    }, []);

    const handleAuthChange = useCallback(async (currentSession: Session | null) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            const role = (currentUser.user_metadata?.role as 'provider' | 'creator') || null;
            setUserType(role);
            await fetchProfile(currentUser, role);
        } else {
            setUserType(null);
            setProfile(null);
        }
        setLoading(false);
    }, [fetchProfile]);

    useEffect(() => {
        // Initial load
        const initAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                await handleAuthChange(session);
            } catch (error) {
                setLoading(false);
            }
        };

        initAuth();

        // Subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleAuthChange(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [handleAuthChange]);

    const signInWithGoogle = async (role: 'provider' | 'creator' = 'creator') => {
        try {
            // Build redirect URL with role parameter
            const redirectUrl = new URL(`${window.location.origin}/auth/callback`);
            redirectUrl.searchParams.set('role', role);
            // Set default redirect path based on role
            redirectUrl.searchParams.set('next', role === 'provider' ? '/provider/offers' : '/creator/offers');

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl.toString(),
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signInWithFacebook = async (role: 'provider' | 'creator' = 'creator') => {
        try {
            // Build redirect URL with role parameter
            const redirectUrl = new URL(`${window.location.origin}/auth/callback`);
            redirectUrl.searchParams.set('role', role);
            // Set default redirect path based on role
            redirectUrl.searchParams.set('next', role === 'provider' ? '/provider/offers' : '/creator/offers');

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: redirectUrl.toString(),
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Facebook", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setSession(null);
            setUserType(null);
            setProfile(null);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, userType, profile, loading, signInWithGoogle, signInWithFacebook, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
