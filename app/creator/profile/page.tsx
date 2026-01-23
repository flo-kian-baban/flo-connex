
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
    User,
    Instagram,
    Youtube,
    Music2,
    BarChart3,
    Loader2,
    Save,
    MapPin,
    Search,
    Globe,
    Zap,
    Video,
    Briefcase
} from "lucide-react";
import {
    GTA_LOCATIONS,
    NICHES,
    PLATFORMS,
    CONTENT_FORMATS,
    AUDIENCE_AGES,
    GENDER_SKEWS,
    DELIVERY_SPEEDS,
    PRODUCTION_STYLES,
    AUDIENCE_FOCUS_OPTIONS
} from "@/lib/constants";
import RangeSelector from "@/components/ui/RangeSelector";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";
import TagInput from "@/components/ui/TagInput";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/lib/toast-context";
// Custom debounce hook




export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // Global saving state (for button)
    const [fieldSaving, setFieldSaving] = useState<string | null>(null); // For individual fields
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        // A) Identity
        display_name: "",
        bio: "",
        primary_platform: "Instagram",
        active_platforms: [] as string[],
        primary_content_format: "",

        // B) Niche
        primary_niche: "",
        secondary_niches: [] as string[], // maps to `niches` column
        content_style_tags: [] as string[],

        // C) Geo
        location_area: "",
        service_areas: [] as string[],
        willing_to_travel: false,

        // D) Audience
        audience_focus: "",
        top_audience_cities: [] as string[],
        audience_location_split: { local: 0, country: 0, international: 0 },
        primary_audience_age: "",
        gender_skew: "",

        // E) Performance
        follower_range: "0-1k",
        avg_views_range: "0-1k",
        engagement_range: "Likely Low",
        top_post_url: "",

        // F) Collab
        past_brand_collaborations: false,
        delivery_speed: "",
        revisions_ok: false,
        production_preference: "",

        // Legacy/Helpers
        avatar_url: ""
    });

    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Initial Fetch
    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("creator_profiles")
                .select("*")
                .eq("user_id", user?.id)
                .single();

            if (data) {
                // Get fallbacks from metadata
                const metaName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
                const metaAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

                setFormData({
                    display_name: data.display_name || metaName,
                    bio: data.bio || "",
                    primary_platform: data.primary_platform || "Instagram",
                    active_platforms: data.active_platforms || [],
                    primary_content_format: data.primary_content_format || "",
                    primary_niche: data.primary_niche || "",
                    secondary_niches: data.niches || [], // Map `niches` to secondary
                    content_style_tags: data.content_style_tags || [],
                    location_area: data.location_area || "",
                    service_areas: data.service_areas || [],
                    willing_to_travel: data.willing_to_travel || false,
                    audience_focus: data.audience_focus || "",
                    top_audience_cities: data.top_audience_cities || [],
                    audience_location_split: data.audience_location_split || { local: 0, country: 0, international: 0 },
                    primary_audience_age: data.primary_audience_age || "",
                    gender_skew: data.gender_skew || "",
                    follower_range: data.follower_range || "0-1k",
                    avg_views_range: data.avg_views_range || "0-1k",
                    engagement_range: data.engagement_range || "Medium",
                    top_post_url: data.top_post_url || "",
                    past_brand_collaborations: data.past_brand_collaborations || false,
                    delivery_speed: data.delivery_speed || "",
                    revisions_ok: data.revisions_ok || false,
                    production_preference: data.production_preference || "",
                    avatar_url: data.avatar_url || metaAvatar
                });
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    // Autosave Logic
    const saveField = async (field: string, value: any) => {
        if (!user?.id) return;

        try {
            setFieldSaving(field);

            // Map secondary_niches back to niches column
            const dbField = field === "secondary_niches" ? "niches" : field;
            const safeValue = value === "" ? null : value; // Convert empty strings to null for DB

            // Use UPDATE instead of UPSERT to avoid NOT NULL constraint violations
            // This assumes a profile row already exists for the user
            const { error: updateError } = await supabase
                .from("creator_profiles")
                .update({
                    [dbField]: safeValue,
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", user.id);

            if (updateError) {
                // If update fails (e.g., no row exists), we can silently ignore for autosave
                // The final "Save Profile" button will create the row with all data
                console.warn(`Autosave update failed for ${field}, row may not exist yet.`, updateError);
                return;
            }
        } catch (err: any) {
            console.error(`Error autosaving ${field}:`, err);
            showToast("Failed to save changes. Please check your connection.", "error");
        } finally {
            setFieldSaving(null);
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Immediate save for non-text fields
        const immediateSaveFields = [
            "primary_platform", "active_platforms", "primary_content_format",
            "primary_niche", "secondary_niches", "content_style_tags",
            "location_area", "service_areas", "willing_to_travel", "audience_focus",
            "top_audience_cities",
            "primary_audience_age", "gender_skew",
            "follower_range", "avg_views_range", "engagement_range",
            "past_brand_collaborations", "delivery_speed", "revisions_ok", "production_preference"
        ];

        if (immediateSaveFields.includes(field)) {
            saveField(field, value);
        }
    };

    const handleBlur = (field: string) => {
        // Save on blur for text fields
        saveField(field, formData[field as keyof typeof formData]);
    };




    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            setUploadingAvatar(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('creator-avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('creator-avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            saveField("avatar_url", publicUrl);

            showToast("Avatar updated successfully!", "success");
        } catch (error: any) {
            console.error("Avatar upload error:", error);
            showToast("Error uploading avatar.", "error");
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Validation for "Completion"
    const calculateCompletion = () => {
        const requiredFields = [
            formData.display_name,
            formData.bio,
            formData.primary_platform,
            formData.primary_content_format,
            formData.primary_niche,
            formData.location_area,
            formData.follower_range,
            formData.avg_views_range,
            formData.engagement_range
        ];
        const filledCount = requiredFields.filter(Boolean).length;
        return Math.round((filledCount / requiredFields.length) * 100);
    };

    const validate = () => {
        if (!formData.display_name) return "Display Name is required.";
        if (!formData.bio) return "Bio is required.";
        if (!formData.primary_platform) return "Primary Platform is required.";
        if (!formData.primary_content_format) return "Content Format is required.";
        if (!formData.primary_niche) return "Primary Niche is required.";
        if (!formData.location_area) return "Primary Location is required.";
        return null;
    };

    const handleFinalSave = async () => {
        setSaving(true);
        const error = validate();
        if (error) {
            showToast(error, "error");
            setSaving(false);
            return;
        }

        // Ensure all fields are saved to DB before redirect
        try {
            // Exclude UI-only fields from DB payload
            const { secondary_niches, ...dbData } = formData;

            const { error: upsertError } = await supabase
                .from("creator_profiles")
                .upsert({
                    user_id: user?.id,
                    ...dbData,
                    niches: secondary_niches, // Map secondary_niches to niches column
                    status: 'submitted',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (upsertError) throw upsertError;

            const redirect = searchParams.get('redirect');

            if (redirect) {
                showToast("Profile ready! Redirecting...", "success");
                setTimeout(() => {
                    const url = new URL(redirect, window.location.origin);
                    if (searchParams.get('autoApply')) url.searchParams.set('autoApply', 'true');
                    router.push(url.pathname + url.search);
                }, 1000);
            } else {
                showToast("Profile saved successfully!", "success");
            }
        } catch (err) {
            console.error("Error saving profile:", err);
            showToast("Failed to save profile. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    };



    // Profile Completion Calculation
    const profileCompletion = useMemo(() => {
        const fields = [
            { key: 'avatar_url', weight: 10, filled: !!formData.avatar_url },
            { key: 'display_name', weight: 10, filled: !!formData.display_name?.trim() },
            { key: 'bio', weight: 10, filled: !!formData.bio?.trim() && formData.bio.length > 20 },
            { key: 'primary_platform', weight: 5, filled: !!formData.primary_platform },
            { key: 'primary_niche', weight: 10, filled: !!formData.primary_niche },
            { key: 'secondary_niches', weight: 5, filled: formData.secondary_niches?.length > 0 },
            { key: 'location_area', weight: 10, filled: !!formData.location_area },
            { key: 'follower_range', weight: 10, filled: formData.follower_range !== '0-1k' },
            { key: 'avg_views_range', weight: 10, filled: formData.avg_views_range !== '0-1k' },
            { key: 'engagement_range', weight: 5, filled: !!formData.engagement_range },
            { key: 'primary_audience_age', weight: 5, filled: !!formData.primary_audience_age },
            { key: 'delivery_speed', weight: 5, filled: !!formData.delivery_speed },
            { key: 'production_preference', weight: 5, filled: !!formData.production_preference },
        ];

        const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
        const filledWeight = fields.reduce((sum, f) => sum + (f.filled ? f.weight : 0), 0);
        const percentage = Math.round((filledWeight / totalWeight) * 100);

        const missingFields = fields.filter(f => !f.filled).map(f => f.key);

        return { percentage, missingFields };
    }, [formData]);

    const getCompletionColor = (pct: number) => {
        if (pct < 40) return 'bg-red-500';
        if (pct < 70) return 'bg-amber-500';
        if (pct < 100) return 'bg-emerald-500';
        return 'bg-primary';
    };

    const getCompletionTip = (missing: string[]) => {
        if (missing.includes('avatar_url')) return "Add a profile photo to stand out";
        if (missing.includes('bio')) return "Write a compelling bio (20+ characters)";
        if (missing.includes('primary_niche')) return "Select your primary niche";
        if (missing.includes('location_area')) return "Add your location";
        if (missing.includes('follower_range') || missing.includes('avg_views_range')) return "Update your performance stats";
        if (missing.length > 0) return "Complete more fields to improve visibility";
        return "Your profile is complete! 🎉";
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="font-medium">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <form onSubmit={(e) => { e.preventDefault(); handleFinalSave(); }} className="pt-8 space-y-10">

                {/* Profile Completion Progress */}
                <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[40px] p-8 md:p-10 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Profile Completion</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tabular-nums">{profileCompletion.percentage}</span>
                                    <span className="text-2xl font-black text-white/50">%</span>
                                </div>
                                <p className="text-sm text-white/70 font-medium">
                                    {getCompletionTip(profileCompletion.missingFields)}
                                </p>
                            </div>
                            <div className="flex-1 max-w-xs">
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div
                                        className={`h-full ${getCompletionColor(profileCompletion.percentage)} rounded-full transition-all duration-700 ease-out`}
                                        style={{ width: `${profileCompletion.percentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                    <span>Starter</span>
                                    <span>Pro</span>
                                    <span>All-Star</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* A) Identity & Positioning */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Identity & Positioning</h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-5 pb-6 border-b border-gray-50">
                        <div className="relative group shrink-0">
                            <div
                                className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-gray-50 shadow-sm flex items-center justify-center cursor-pointer hover:border-primary/20 transition-all"
                                onClick={() => document.getElementById('avatar-input')?.click()}
                            >
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-gray-300" />
                                )}
                            </div>
                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            )}
                            <input
                                id="avatar-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploadingAvatar}
                            />
                        </div>

                        <div className="flex flex-col w-full space-y-3 ml-2 mt-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Display Name (Required)</label>
                            <input
                                type="text"
                                value={formData.display_name}
                                onChange={(e) => handleFieldChange("display_name", e.target.value)}
                                onBlur={() => handleBlur("display_name")}
                                placeholder="e.g. Alex Creator"
                                className="w-full md:w-1/2 h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                            />

                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Bio (Required)</label>
                                <span className="text-[10px] font-bold text-gray-300">{formData.bio.length} chars</span>
                            </div>
                            <textarea
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => handleFieldChange("bio", e.target.value)}
                                onBlur={() => handleBlur("bio")}
                                placeholder="Tell us about yourself..."
                                className="w-full py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold resize-y min-h-[120px]"
                            />

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Primary Platform (Required)</label>
                                <Dropdown
                                    options={PLATFORMS.map(p => ({ label: p, value: p }))}
                                    value={formData.primary_platform}
                                    onChange={(val) => handleFieldChange("primary_platform", val)}
                                    placeholder="Select primary platform"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Primary Content Format (Required)</label>
                                <Dropdown
                                    options={CONTENT_FORMATS.map(f => ({ label: f, value: f }))}
                                    value={formData.primary_content_format}
                                    onChange={(val) => handleFieldChange("primary_content_format", val)}
                                    placeholder="Select content format"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Platforms Active On</label>
                            <MultiSelect
                                options={PLATFORMS}
                                selected={formData.active_platforms}
                                onChange={(val) => handleFieldChange("active_platforms", val)}
                                placeholder="Select other platforms..."
                            />
                        </div>
                    </div>
                </section>

                {/* B) Niche & Content Focus */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Niche & Content</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <TagInput
                                label="Primary Niche *"
                                description="Select the one category that best describes your content."
                                className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2"
                                value={formData.primary_niche ? [formData.primary_niche] : []}
                                onChange={(val) => handleFieldChange("primary_niche", val[0] || "")}
                                suggestions={NICHES}
                                maxTags={1}
                                placeholder="Start typing..."
                            />

                            <TagInput
                                label="Secondary Niches (Optional)"
                                description="Select up to 5 additional categories."
                                className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2"
                                value={formData.secondary_niches}
                                onChange={(val) => handleFieldChange("secondary_niches", val)}
                                suggestions={NICHES}
                                maxTags={5}
                                placeholder="Start typing..."
                            />
                        </div>

                        <TagInput
                            label="Content Style Tags (Optional)"
                            value={formData.content_style_tags}
                            onChange={(val) => handleFieldChange("content_style_tags", val)}
                            suggestions={["UGC", "Reviews", "Before/After", "Educational", "Storytelling", "Comedy", "Cinematic", "Trends", "Voiceover"]}
                            maxTags={8}
                            allowNew={true}
                            description="e.g. UGC, Cinematic, Storytelling..."
                        />
                    </div>
                </section>

                {/* C) Geographic Relevance */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Location & Geo</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Primary Location (Required)</label>
                            <Dropdown
                                options={GTA_LOCATIONS.map(l => ({ label: l, value: l }))}
                                value={formData.location_area}
                                onChange={(val) => handleFieldChange("location_area", val)}
                                placeholder="Select GTA location"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Service Areas</label>
                            <MultiSelect
                                options={GTA_LOCATIONS}
                                selected={formData.service_areas}
                                onChange={(val) => handleFieldChange("service_areas", val)}
                                placeholder="Areas you are willing to commute to..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <Toggle
                                label="Willing to travel?"
                                checked={formData.willing_to_travel}
                                onChange={(val) => handleFieldChange("willing_to_travel", val)}
                            />

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Audience Focus</label>
                                <Dropdown
                                    options={AUDIENCE_FOCUS_OPTIONS.map(o => ({ label: o, value: o }))}
                                    value={formData.audience_focus}
                                    onChange={(val) => handleFieldChange("audience_focus", val)}
                                    placeholder="Select audience focus"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* D) Audience Profile */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Audience Profile</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Audience Location Focus *</label>
                                <Dropdown
                                    options={AUDIENCE_FOCUS_OPTIONS.map(a => ({ label: a, value: a }))}
                                    value={formData.audience_focus}
                                    onChange={(val) => handleFieldChange("audience_focus", val)}
                                    placeholder="Select Focus"
                                />
                            </div>

                            <div className="space-y-1">
                                <TagInput
                                    label="Top Audience Cities (Optional)"
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2"
                                    value={formData.top_audience_cities}
                                    onChange={(val) => handleFieldChange("top_audience_cities", val)}
                                    suggestions={GTA_LOCATIONS}
                                    maxTags={5}
                                    placeholder="e.g. Toronto"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Audience Age</label>
                                <Dropdown
                                    options={AUDIENCE_AGES.map(a => ({ label: a, value: a }))}
                                    value={formData.primary_audience_age}
                                    onChange={(val) => handleFieldChange("primary_audience_age", val)}
                                    placeholder="Select primary age range"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Gender Skew</label>
                                <Dropdown
                                    options={GENDER_SKEWS.map(g => ({ label: g, value: g }))}
                                    value={formData.gender_skew}
                                    onChange={(val) => handleFieldChange("gender_skew", val)}
                                    placeholder="Select gender skew"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* E) Performance Signals */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Performance (Primary Platform)</h2>
                    </div>

                    <div className="space-y-10">
                        <RangeSelector
                            label="Followers (Required)"
                            options={[
                                { label: "<5k", value: "<5k" },
                                { label: "5k-10k", value: "5k-10k" },
                                { label: "10k-25k", value: "10k-25k" },
                                { label: "25k-50k", value: "25k-50k" },
                                { label: "50k+", value: "50k+" },
                            ]}
                            value={formData.follower_range}
                            onChange={(val) => handleFieldChange("follower_range", val)}
                        />

                        <RangeSelector
                            label="Average Views (Required)"
                            options={[
                                { label: "<1k", value: "<1k" },
                                { label: "1k-5k", value: "1k-5k" },
                                { label: "5k-10k", value: "5k-10k" },
                                { label: "10k-25k", value: "10k-25k" },
                                { label: "25k+", value: "25k+" },
                            ]}
                            value={formData.avg_views_range}
                            onChange={(val) => handleFieldChange("avg_views_range", val)}
                        />

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Engagement Quality (Required)</label>
                            <Dropdown
                                options={[
                                    { label: "Low", value: "Low" },
                                    { label: "Medium", value: "Medium" },
                                    { label: "High", value: "High" }
                                ]}
                                value={formData.engagement_range}
                                onChange={(val) => handleFieldChange("engagement_range", val)}
                                placeholder="Select engagement level"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Top Performing Post URL</label>
                            <input
                                type="url"
                                value={formData.top_post_url}
                                onChange={(e) => handleFieldChange("top_post_url", e.target.value)}
                                onBlur={() => handleBlur("top_post_url")}
                                placeholder="https://..."
                                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-sm"
                            />

                        </div>
                    </div>
                </section>

                {/* F) Collaboration Reliability */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Collaboration Style</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Toggle
                                label="Past Brand Collaborations?"
                                checked={formData.past_brand_collaborations}
                                onChange={(val) => handleFieldChange("past_brand_collaborations", val)}
                            />
                            <Toggle
                                label="Comfortable with Revisions?"
                                checked={formData.revisions_ok}
                                onChange={(val) => handleFieldChange("revisions_ok", val)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Delivery Speed</label>
                                <Dropdown
                                    options={DELIVERY_SPEEDS.map(s => ({ label: s, value: s }))}
                                    value={formData.delivery_speed}
                                    onChange={(val) => handleFieldChange("delivery_speed", val)}
                                    placeholder="Select typical delivery time"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Production Preference</label>
                                <Dropdown
                                    options={PRODUCTION_STYLES.map(s => ({ label: s, value: s }))}
                                    value={formData.production_preference}
                                    onChange={(val) => handleFieldChange("production_preference", val)}
                                    placeholder="Select style"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Submit Bar */}
                <div className="pt-12 flex justify-center md:justify-end pb-10">
                    <button
                        type="submit"
                        className="w-full md:w-auto h-16 px-12 bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/20 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    >
                        <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Save & Complete
                    </button>
                </div>
            </form>
        </div>
    );
}
