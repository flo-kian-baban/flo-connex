"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { GTA_LOCATIONS } from "@/lib/constants";
import MultiSelect from "@/components/ui/MultiSelect";
import { Trash2, Save, Loader2, Globe, Instagram, Mail, Phone, MapPin, ListChecks, Building2, ShieldCheck, Trophy, Target, Calendar, Hash, X, Plus, Image as ImageIcon, Check, ChevronDown, Camera, Award, Star, CheckCircle2, Tag } from "lucide-react";
import IndustrySelect from "@/components/ui/IndustrySelect";

interface ProviderProfile {
    id: string;
    business_name: string;
    category: string | null;
    tagline: string | null;
    brand_description: string | null;
    address: string | null;
    website: string | null;
    instagram_handle: string | null;
    phone_number: string | null;
    email: string | null;
    logo_url: string | null;
    service_areas: string[];
    years_in_business: number | null;
    google_rating: number | null;
    google_review_count: number | null;
    google_business_account_id: string | null;
    google_location_id: string | null;
    // google_maps_url: string | null; // Deprecated
    why_creators_love_us: string[];
}

export default function ProviderSettingsPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [formData, setFormData] = useState<ProviderProfile>({
        id: "",
        business_name: "",
        category: "",
        tagline: "",
        brand_description: "",
        address: "",
        website: "",
        instagram_handle: "",
        phone_number: "",
        email: "",
        logo_url: "",
        service_areas: [],
        years_in_business: null,
        google_rating: null,
        google_review_count: null,
        google_business_account_id: null,
        google_location_id: null,
        // google_maps_url: "",
        why_creators_love_us: [],
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from("providers")
                    .select("*")
                    .eq("claimed_by_user_id", user.id)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        // No profile found, silent return to allow creation
                        console.log("No profile found, ready to create.");
                    } else {
                        console.error("Error fetching provider profile:", error);
                        showToast("Could not load provider profile.", "error");
                    }
                } else if (data) {
                    setFormData({
                        id: data.id,
                        business_name: data.business_name || "",
                        category: data.category || "",
                        tagline: data.tagline || "",
                        brand_description: data.brand_description || "",
                        address: data.address || "",
                        website: data.website || "",
                        instagram_handle: data.instagram_handle || "",
                        phone_number: data.phone_number || "",
                        email: data.email || "",
                        logo_url: data.logo_url || "",
                        service_areas: data.service_areas || [],
                        years_in_business: data.years_in_business,
                        google_rating: data.google_rating,
                        google_review_count: data.google_review_count,
                        google_business_account_id: data.google_business_account_id,
                        google_location_id: data.google_location_id,
                        // google_maps_url: data.google_maps_url || "",
                        why_creators_love_us: data.why_creators_love_us || [],
                    });
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `logo.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast("Logo must be less than 5MB", "error");
            return;
        }

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            showToast("Only JPG, PNG, and WebP formats are allowed", "error");
            return;
        }

        setUploadingLogo(true);

        try {
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('provider-logos')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('provider-logos')
                .getPublicUrl(filePath);

            // Update local state
            setFormData(prev => ({ ...prev, logo_url: publicUrl }));

            // Update database immediately ONLY if profile exists
            if (formData.id) {
                const { error: dbError } = await supabase
                    .from('providers')
                    .update({ logo_url: publicUrl })
                    .eq('id', formData.id);

                if (dbError) throw dbError;
            }

            showToast("Logo uploaded! Don't forget to save changes.", "success");
        } catch (error: any) {
            console.error('Error uploading logo:', error);
            showToast(error.message || "Failed to upload logo", "error");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (!user) throw new Error("Not authenticated");

            const updatePayload = {
                business_name: formData.business_name,
                category: formData.category,
                tagline: formData.tagline,
                brand_description: formData.brand_description,
                address: formData.address,
                website: formData.website,
                instagram_handle: formData.instagram_handle,
                phone_number: formData.phone_number,
                email: formData.email,
                logo_url: formData.logo_url,
                service_areas: formData.service_areas,
                location_area: formData.service_areas.length > 0 ? formData.service_areas[0] : null,
                years_in_business: formData.years_in_business,
                google_rating: formData.google_rating,
                google_review_count: formData.google_review_count,
                // google_maps_url: formData.google_maps_url,
                why_creators_love_us: formData.why_creators_love_us,
            };

            if (formData.id) {
                // UPDATE existing profile
                const { error } = await supabase
                    .from("providers")
                    .update(updatePayload)
                    .eq("id", formData.id);

                if (error) throw error;
            } else {
                // INSERT new profile
                const { data, error } = await supabase
                    .from("providers")
                    .insert({
                        ...updatePayload,
                        claimed_by_user_id: user.id,
                    })
                    .select()
                    .single();

                if (error) throw error;

                if (data) {
                    setFormData(prev => ({ ...prev, id: data.id }));
                }
            }

            showToast("Profile settings saved successfully!", "success");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving profile:", error);
            showToast(error.message || "Failed to save settings.", "error");
        } finally {
            setSaving(false);
        }
    };

    const updateWhyCreatorsBullet = (index: number, value: string) => {
        setFormData(prev => {
            const current = [...prev.why_creators_love_us];
            current[index] = value;
            return { ...prev, why_creators_love_us: current.filter(b => b !== "" || index === current.length - 1) };
        });
    };

    const addWhyCreatorsBullet = () => {
        if (formData.why_creators_love_us.length < 3) {
            setFormData(prev => ({
                ...prev,
                why_creators_love_us: [...prev.why_creators_love_us, ""]
            }));
        }
    };

    const removeWhyCreatorsBullet = (index: number) => {
        setFormData(prev => ({
            ...prev,
            why_creators_love_us: prev.why_creators_love_us.filter((_, i) => i !== index)
        }));
    };

    const calculateCompleteness = () => {
        const fields = [
            formData.business_name,
            formData.logo_url,
            formData.tagline,
            formData.brand_description,
            formData.website,
            formData.instagram_handle,
            formData.phone_number,
            formData.email,
            formData.address,
            formData.service_areas.length > 0,
            formData.years_in_business,
            formData.google_rating,
            formData.why_creators_love_us.length > 0
        ];
        const completed = fields.filter(f => !!f).length;
        return Math.round((completed / fields.length) * 100);
    };

    const completeness = calculateCompleteness();

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-0">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Provider Profile</h1>
                    <p className="text-base text-gray-500">How creators see your brand on Connex.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <ListChecks className="h-4 w-4 text-[#FF4D22]" />
                        <span>{completeness}% Complete</span>
                    </div>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full bg-[#FF4D22] transition-all duration-500"
                            style={{ width: `${completeness}%` }}
                        />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Brand Identity */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Brand Identity</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-8">
                            <div className="relative h-24 w-24 flex-shrink-0">
                                <div className="h-full w-full rounded-full overflow-hidden rounded-3xl border-2 border-gray-50 bg-gray-50 shadow-inner">
                                    {formData.logo_url ? (
                                        <img
                                            src={formData.logo_url}
                                            alt="Business Logo"
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-200">
                                            <Building2 className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="logo-upload"
                                    className={`absolute -bottom-2 -right-1 flex h-10 w-10 cursor-pointer rounded-full items-center justify-center rounded-2xl bg-white shadow-xl transition-transform hover:scale-110 active:scale-95 ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploadingLogo ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-[#FF4D22]" />
                                    ) : (
                                        <Camera className="h-5 w-5 text-gray-600" />
                                    )}
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                        disabled={uploadingLogo}
                                    />
                                </label>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Business Logo</h3>
                                <p className="text-sm text-gray-500">This is the first thing creators see. Use a high-quality logo.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Business Name *</label>
                                <input
                                    type="text"
                                    name="business_name"
                                    required
                                    value={formData.business_name || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Aura Wellness"
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Tagline</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={formData.tagline || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Luxury Skincare in Toronto"
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Industry (Category) *</label>
                                <IndustrySelect
                                    value={formData.category}
                                    onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. About Section */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <ListChecks className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">About Your Brand</h2>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Brand Description *</label>
                        <textarea
                            name="brand_description"
                            required
                            rows={5}
                            value={formData.brand_description || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, brand_description: e.target.value }))}
                            placeholder="Tell creators about your story, your mission, and what makes your treatments or products unique..."
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5 min-h-[120px] resize-none"
                        />
                        <p className="text-[11px] text-gray-400 mt-1 italic pl-1">A strong description builds trust and helps creators pitch better content.</p>
                    </div>
                </div>

                {/* 3. Contact & Location */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Contact & Trust Signals</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 text-gray-400 ml-1">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website || ""}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Instagram handle</label>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    name="instagram_handle"
                                    value={formData.instagram_handle || ""}
                                    onChange={handleInputChange}
                                    placeholder="brandname"
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number || ""}
                                    onChange={handleInputChange}
                                    placeholder="+1..."
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    placeholder="contact@..."
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                        </div>

                        <div className="col-span-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Service Address *</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address || ""}
                                    onChange={handleInputChange}
                                    placeholder="Studio 101, 123 Business St, Toronto, ON"
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                        </div>

                        <div className="col-span-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">GTA Service Areas *</label>
                            <MultiSelect
                                options={GTA_LOCATIONS}
                                selected={formData.service_areas}
                                onChange={(selected) => setFormData(prev => ({ ...prev, service_areas: selected }))}
                                placeholder="Select the areas where you offer services..."
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Credibility Section */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <Award className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Proof and Credibility</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Years in Business</label>
                            <input
                                type="number"
                                name="years_in_business"
                                value={formData.years_in_business || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, years_in_business: e.target.value ? parseInt(e.target.value) : null }))}
                                placeholder="e.g. 5"
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Google Rating</label>
                            <div className="relative">
                                <Star className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    name="google_rating"
                                    value={formData.google_rating || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, google_rating: e.target.value ? parseFloat(e.target.value) : null }))}
                                    placeholder="4.8"
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                        </div>

                        <div className="col-span-full space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Google Reviews Integration</label>
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-normal text-gray-900">Google Business Profile</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    disabled
                                    className="px-6 py-2 bg-[#4285F4] text-white text-xs font-bold rounded-xl shadow-sm opacity-50 cursor-not-allowed flex items-center gap-2">
                                    Connect
                                </button>
                            </div>
                        </div>

                        <div className="col-span-full space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Why Creators Love Us (Max 3)</label>
                                {formData.why_creators_love_us.length < 3 && (
                                    <button
                                        type="button"
                                        onClick={addWhyCreatorsBullet}
                                        className="text-xs font-bold text-[#FF4D22] hover:underline"
                                    >
                                        + Add Point
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {formData.why_creators_love_us.map((bullet, index) => (
                                    <div key={index} className="group relative flex items-center gap-2">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-black text-gray-400">
                                            {index + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={bullet}
                                            onChange={(e) => updateWhyCreatorsBullet(index, e.target.value)}
                                            placeholder="e.g. Free aftercare products included"
                                            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeWhyCreatorsBullet(index)}
                                            className="hidden p-2 text-gray-300 hover:text-red-400 group-hover:block"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {formData.why_creators_love_us.length === 0 && (
                                    <p className="text-[11px] text-gray-400 italic">No highlights added yet. These appear as bullet points on your offers.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-8 z-10 flex items-center justify-between rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${completeness === 100 ? 'bg-green-500' : 'bg-gray-200'} text-white`}>
                            {completeness === 100 ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-600">
                            {completeness === 100 ? 'Profile logic is perfect!' : `${100 - completeness}% more to go`}
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-3.5 text-sm font-black text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-black active:translate-y-0 disabled:opacity-70"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
