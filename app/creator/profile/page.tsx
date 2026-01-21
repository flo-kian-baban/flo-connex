"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
    User,
    Globe,
    Instagram,
    Youtube,
    Music2,
    BarChart3,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save,
    MapPin,
    Tag,
    Languages,
    ChevronDown,
    Plus,
    X,
    Search,
    Camera
} from "lucide-react";
import { GTA_LOCATIONS, CONTENT_TYPES, NICHES, LANGUAGES } from "@/lib/constants";
import RangeSelector from "@/components/ui/RangeSelector";
import { useToast } from "@/lib/toast-context";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        display_name: "",
        bio: "",
        location_area: "",
        primary_platform: "instagram",
        primary_handle: "",
        primary_url: "",
        niches: [] as string[],
        content_types: [] as string[],
        languages: [] as string[],
        follower_range: "0-1k",
        avg_views_range: "0-1k",
        engagement_range: "1-3%",
        avatar_url: ""
    });

    const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
                setFormData({
                    display_name: data.display_name || "",
                    bio: data.bio || "",
                    location_area: data.location_area || "",
                    primary_platform: data.primary_platform || "instagram",
                    primary_handle: data.primary_handle || "",
                    primary_url: data.primary_url || "",
                    niches: data.niches || [],
                    content_types: data.content_types || [],
                    languages: data.languages || [],
                    follower_range: data.follower_range || "0-1k",
                    avg_views_range: data.avg_views_range || "0-1k",
                    engagement_range: data.engagement_range || "1-3%",
                    avatar_url: data.avatar_url || ""
                });
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        if (!formData.display_name) return "Name is required.";
        if (!formData.location_area) return "Location is required.";
        if (!formData.primary_handle) return "Social handle is required.";
        if (!formData.primary_url.startsWith("http")) return "Provide a valid URL for your profile.";

        if (formData.niches.length < 1) return "Please select at least one niche.";
        if (formData.niches.length > 5) return "Please select maximum 5 niches.";

        if (formData.content_types.length < 1) return "Please select at least one content type.";
        if (formData.content_types.length > 5) return "Please select maximum 5 content types.";

        if (formData.languages.length > 3) return "Maximum 3 languages allowed.";

        return null;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            showToast(error, "error");
            return;
        }

        try {
            setSaving(true);

            const { error: upsertError } = await supabase
                .from("creator_profiles")
                .upsert({
                    user_id: user?.id,
                    display_name: formData.display_name,
                    bio: formData.bio,
                    location_area: formData.location_area,
                    primary_platform: formData.primary_platform,
                    primary_handle: formData.primary_handle,
                    primary_url: formData.primary_url,
                    niches: formData.niches,
                    content_types: formData.content_types,
                    languages: formData.languages,
                    follower_range: formData.follower_range,
                    avg_views_range: formData.avg_views_range,
                    engagement_range: formData.engagement_range,
                    status: 'submitted',
                    submitted_at: new Date().toISOString()
                });

            if (upsertError) throw upsertError;

            const redirect = searchParams.get('redirect');
            const autoApply = searchParams.get('autoApply');

            if (redirect) {
                showToast("Profile updated! Returning to offer...", "success");
                setTimeout(() => {
                    const url = new URL(redirect, window.location.origin);
                    if (autoApply) url.searchParams.set('autoApply', 'true');
                    router.push(url.pathname + url.search);
                }, 1500);
            } else {
                showToast("Profile updated! Refreshing workspace...", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (err: any) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            setUploadingAvatar(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('creator-avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('creator-avatars')
                .getPublicUrl(filePath);

            // Update State
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

            // Update Database Immediately
            const { error: dbError } = await supabase
                .from('creator_profiles')
                .update({ avatar_url: publicUrl })
                .eq('user_id', user?.id);

            if (dbError) throw dbError;

            showToast("Avatar updated successfully!", "success");
        } catch (error: any) {
            console.error("Avatar upload error:", error);
            showToast("Error uploading avatar. Please try again.", "error");
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Normalization helper
    const normalizeTag = (val: string) => {
        return val
            .trim()
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Niche management
    const [nicheSearch, setNicheSearch] = useState("");
    const [showNicheSuggestions, setShowNicheSuggestions] = useState(false);

    const filteredNicheSuggestions = NICHES.filter(n =>
        n.toLowerCase().includes(nicheSearch.toLowerCase()) &&
        !formData.niches.includes(n)
    );

    const addNiche = (niche: string) => {
        const normalized = normalizeTag(niche);
        if (normalized && formData.niches.length < 5 && !formData.niches.includes(normalized)) {
            setFormData(prev => ({ ...prev, niches: [...prev.niches, normalized] }));
            setNicheSearch("");
            setShowNicheSuggestions(false);
        }
    };

    const removeNiche = (niche: string) => {
        setFormData(prev => ({ ...prev, niches: prev.niches.filter(n => n !== niche) }));
    };

    const handleNicheKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !nicheSearch && formData.niches.length > 0) {
            removeNiche(formData.niches[formData.niches.length - 1]);
        } else if ((e.key === 'Enter' || e.key === ',') && nicheSearch) {
            e.preventDefault();
            addNiche(nicheSearch);
        }
    };

    const toggleContentType = (type: string) => {
        setFormData(prev => {
            const current = [...prev.content_types];
            const index = current.indexOf(type);
            if (index > -1) {
                current.splice(index, 1);
            } else if (current.length < 5) {
                current.push(type);
            }
            return { ...prev, content_types: current };
        });
    };

    // Language management
    const [langSearch, setLangSearch] = useState("");
    const [showLangSuggestions, setShowLangSuggestions] = useState(false);

    const filteredLangSuggestions = LANGUAGES.filter(l =>
        l.toLowerCase().includes(langSearch.toLowerCase()) &&
        !formData.languages.includes(l)
    );

    const addLanguage = (lang: string) => {
        const normalized = normalizeTag(lang);
        if (normalized && formData.languages.length < 3 && !formData.languages.includes(normalized)) {
            setFormData(prev => ({ ...prev, languages: [...prev.languages, normalized] }));
            setLangSearch("");
            setShowLangSuggestions(false);
        }
    };

    const removeLanguage = (lang: string) => {
        setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
    };

    const handleLangKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !langSearch && formData.languages.length > 0) {
            removeLanguage(formData.languages[formData.languages.length - 1]);
        } else if ((e.key === 'Enter' || e.key === ',') && langSearch) {
            e.preventDefault();
            addLanguage(langSearch);
        }
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className=" font-medium">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <form onSubmit={handleSave} className="pt-8 space-y-10">

                {/* 1. Identity & Bio */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 ">Identity</h2>
                    </div>

                    {/* Avatar & Name Row */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-6 border-b border-gray-50">
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

                        <div className="w-full flex flex-col space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Public Name</label>
                            <input
                                type="text"
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                placeholder="e.g. Alex Creator"
                                className="w-1/2 h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Bio</label>
                                <span className="text-[10px] font-bold text-gray-300">{formData.bio.length} / 240</span>
                            </div>
                            <textarea
                                maxLength={240}
                                rows={2}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Briefly describe your content style and audience..."
                                className="w-full min-h-[56px] py-4 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold resize-none"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2 mt-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Location Area (GTA Only)</label>
                            <div className="relative group">
                                <select
                                    value={formData.location_area}
                                    onChange={(e) => setFormData({ ...formData, location_area: e.target.value })}
                                    className="w-full h-14 pl-12 pr-10 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">Select your area...</option>
                                    {GTA_LOCATIONS.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-[12px] ml-2 text-gray-400 font-medium ">Connex is currently exclusive to the Greater Toronto Area (GTA).</p>
                        </div>
                    </div>
                </section>

                {/* 2. Social Channels */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <Instagram className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Social Channels</h2>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Primary Platform</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'instagram', icon: Instagram, label: 'Instagram' },
                                    { id: 'tiktok', icon: Music2, label: 'TikTok' },
                                    { id: 'youtube', icon: Youtube, label: 'YouTube' }
                                ].map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, primary_platform: p.id })}
                                        className={`h-14 rounded-2xl border transition-all flex items-center justify-center gap-2 font-bold ${formData.primary_platform === p.id ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        <p.icon className="w-4 h-4" />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Primary Handle</label>
                                <input
                                    type="text"
                                    value={formData.primary_handle}
                                    onChange={(e) => setFormData({ ...formData, primary_handle: e.target.value })}
                                    placeholder="@username"
                                    className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                                />
                                <p className="text-[10px] text-gray-400 font-medium">Include the '@' symbol for clarity.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Profile URL</label>
                                <input
                                    type="url"
                                    value={formData.primary_url}
                                    onChange={(e) => setFormData({ ...formData, primary_url: e.target.value })}
                                    placeholder="https://instagram.com/username"
                                    className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-sm"
                                />
                                <p className="text-[10px] text-gray-400 font-medium">Must be a full valid link.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Performance & Categories */}
                <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gray-50 rounded-2xl">
                            <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Analytics & Niches</h2>
                    </div>

                    <div className="space-y-10">
                        <RangeSelector
                            label="Followers"
                            options={[
                                { label: "0 - 1,000", value: "0-1k" },
                                { label: "1,000 - 5,000", value: "1k-5k" },
                                { label: "5,000 - 10,000", value: "5k-10k" },
                                { label: "10,000 - 50,000", value: "10k-50k" },
                                { label: "50,000 - 100,000", value: "50k-100k" },
                                { label: "100,000+", value: "100k+" },
                            ]}
                            value={formData.follower_range}
                            onChange={(val) => setFormData({ ...formData, follower_range: val })}
                        />

                        <RangeSelector
                            label="Avg. Views"
                            options={[
                                { label: "0 - 1,000", value: "0-1k" },
                                { label: "1,000 - 5,000", value: "1k-5k" },
                                { label: "5,000 - 20,000", value: "5k-20k" },
                                { label: "20,000 - 100,000", value: "20k-100k" },
                                { label: "100,000+", value: "100k+" },
                            ]}
                            value={formData.avg_views_range}
                            onChange={(val) => setFormData({ ...formData, avg_views_range: val })}
                        />

                        <RangeSelector
                            label="Engagement"
                            options={[
                                { label: "< 1%", value: "<1%" },
                                { label: "1% - 3%", value: "1-3%" },
                                { label: "3% - 6%", value: "3-6%" },
                                { label: "6% +", value: "6%+" },
                            ]}
                            value={formData.engagement_range}
                            onChange={(val) => setFormData({ ...formData, engagement_range: val })}
                        />
                    </div>

                    <div className="space-y-8 pt-4">
                        <div className="space-y-4">
                            <label className="text-s font-black uppercase tracking-wide text-black flex items-center gap-3">
                                <Search className="ml-1 w-5 h-5" />
                                Your Niches (Select 1-5)
                            </label>
                            <div className="relative">
                                <div
                                    className="min-h-[72px] w-full p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all outline-none"
                                    onClick={() => document.getElementById('niche-input')?.focus()}
                                >
                                    {formData.niches.map(niche => (
                                        <span
                                            key={niche}
                                            className="h-10 pl-4 pr-2 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-900 group/pill"
                                        >
                                            {niche}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeNiche(niche); }}
                                                className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center text-gray-300"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {formData.niches.length < 5 && (
                                        <input
                                            id="niche-input"
                                            type="text"
                                            value={nicheSearch}
                                            onChange={(e) => { setNicheSearch(e.target.value); setShowNicheSuggestions(true); }}
                                            onKeyDown={handleNicheKeyDown}
                                            onFocus={() => setShowNicheSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowNicheSuggestions(false), 200)}
                                            placeholder={formData.niches.length === 0 ? "e.g. Lifestyle, Travel..." : ""}
                                            className="flex-1 min-w-[120px] h-10 bg-transparent border-none outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal "
                                        />
                                    )}
                                </div>

                                {/* Suggestions Dropdown */}
                                {showNicheSuggestions && nicheSearch && filteredNicheSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                        {filteredNicheSuggestions.map(suggestion => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => addNiche(suggestion)}
                                                className="w-full text-[12px] text-left px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors text-sm font-bold flex items-center justify-between group"
                                            >
                                                {suggestion}
                                                <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-[12px] text-gray-400 font-medium ml-2">Type to filter. Select from the fixed list of standardized creator niches.</p>
                        </div>

                        <div className="space-y-5">
                            <label className="text-s font-black uppercase tracking-wide text-black flex items-center gap-3">
                                <BarChart3 className="ml-1 w-5 h-5" />
                                Content Types (Select 1-5)
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {CONTENT_TYPES.map(type => {
                                    const isSelected = formData.content_types.includes(type);
                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleContentType(type)}
                                            className={`px-4 py-2.5 rounded-xl border-2 text-[12px] font-black uppercase tracking-widest transition-all ${isSelected
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 -translate-y-0.5'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20 hover:bg-primary/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                {type}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[12px] text-gray-400 font-medium ml-1">Standardizing your content types helps brands find you more easily.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-s font-black uppercase tracking-wide text-black flex items-center gap-3">
                                <Languages className="w-5 h-5 ml-1" />
                                Languages (Max 3)
                            </label>
                            <div className="relative">
                                <div
                                    className="min-h-[72px] w-full p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all outline-none"
                                    onClick={() => document.getElementById('lang-input')?.focus()}
                                >
                                    {formData.languages.map(lang => (
                                        <span
                                            key={lang}
                                            className="h-10 pl-4 pr-2 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-900 group/pill"
                                        >
                                            {lang}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeLanguage(lang); }}
                                                className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center text-gray-300"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {formData.languages.length < 3 && (
                                        <input
                                            id="lang-input"
                                            type="text"
                                            value={langSearch}
                                            onChange={(e) => { setLangSearch(e.target.value); setShowLangSuggestions(true); }}
                                            onKeyDown={handleLangKeyDown}
                                            onFocus={() => setShowLangSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowLangSuggestions(false), 200)}
                                            placeholder={formData.languages.length === 0 ? "e.g. English, French..." : ""}
                                            className="flex-1 min-w-[120px] h-10 bg-transparent border-none outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                                        />
                                    )}
                                </div>

                                {/* Language Suggestions Dropdown */}
                                {showLangSuggestions && langSearch && filteredLangSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                        {filteredLangSuggestions.map(suggestion => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => addLanguage(suggestion)}
                                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors text-sm font-bold flex items-center justify-between group"
                                            >
                                                {suggestion}
                                                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-[12px] text-gray-400 font-medium">Type to search for languages you speak fluently.</p>
                        </div>
                    </div>
                </section>

                {/* Non-sticky Submission Bar */}
                <div className="pt-12 flex justify-center md:justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full md:w-auto h-16 px-12 bg-primary hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/20 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Save
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
