"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Loader2, ArrowRight } from "lucide-react";
import { GTA_LOCATIONS } from "@/lib/constants";

export default function ProviderOnboardingPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Form State
    const [businessName, setBusinessName] = useState("");
    const [category, setCategory] = useState("Skincare"); // default
    const [location, setLocation] = useState(GTA_LOCATIONS[0]);
    const [website, setWebsite] = useState("");

    useEffect(() => {
        if (user) {
            checkExistingProfile();
        }
    }, [user]);

    const checkExistingProfile = async () => {
        try {
            const { data, error } = await supabase
                .from("providers")
                .select("*")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (data) {
                // Already has a profile, redirect to dashboard
                router.push("/provider/offers");
            } else {
                setInitialCheckDone(true);
            }
        } catch (error) {
            console.error(error);
            setInitialCheckDone(true);
        }
    };

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("providers")
                .insert({
                    claimed_by_user_id: user?.id,
                    business_name: businessName,
                    category: category,
                    location_area: location,
                    website: website,
                    // logo_url can be added later or defaults handled
                });

            if (error) throw error;

            showToast("Profile created! Setting up your workspace...", "success");
            setTimeout(() => {
                window.location.href = "/provider/offers";
            }, 1000);
        } catch (error: any) {
            console.error("Error creating profile:", error);
            showToast("Failed to create profile. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!initialCheckDone) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="text-center mb-10">
                <div className="mx-auto w-16 h-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-6 text-primary">
                    <Building2 className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Setup your Business</h1>
                <p className="text-gray-500 text-lg">
                    Create your provider profile to start posting offers.
                </p>
            </div>

            <form onSubmit={handleCreateProfile} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary outline-none font-medium transition-all"
                            placeholder="e.g. Acme Studio"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary outline-none font-medium transition-all"
                            >
                                <option value="Skincare">Skincare</option>
                                <option value="Dental">Dental</option>
                                <option value="Fitness">Fitness</option>
                                <option value="Dining">Dining</option>
                                <option value="Automotive">Automotive</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Wellness">Wellness</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Tech">Tech</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value as any)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary outline-none font-medium transition-all"
                            >
                                {GTA_LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Website (Optional)</label>
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary outline-none font-medium transition-all"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Create Profile
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
