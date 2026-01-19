"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import {
    MoveLeft,
    Loader2,
    Save,
    Trash2,
    Camera,
    Image as ImageIcon,
    Target,
    Zap,
    MapPin,
    Calendar,
    Tag,
    Hash,
    X,
    Check,
    ChevronDown,
    ListChecks,
    Plus,
    AlertCircle,
    CheckCircle2,
    Instagram
} from "lucide-react";
import { GTA_LOCATIONS, NICHES, CONTENT_TYPES } from "@/lib/constants";
import MultiSelect from "@/components/ui/MultiSelect";

interface Deliverable {
    type: string;
    count: number;
}

export default function OfferFormPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();

    // id will be "new" or a uuid
    const isNew = params.id === "new";
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        category: NICHES[0] as string,
        description: "",
        exchange_type: "free", // free, discount, gifted
        discount_percentage: "",
        service_areas: [] as string[],
        status: "draft", // draft, published
        cover_url: "",
        provider_id: "",
        quantity: "" as string | number,
        deliverables: [] as Deliverable[],
        timeline: "",
        style_requirements: "",
        required_tags: "",
        restrictions: ""
    });

    useEffect(() => {
        if (user) {
            fetchProviderAndOffer();
        }
    }, [user, params.id]);

    const fetchProviderAndOffer = async () => {
        try {
            // Get Provider ID
            const { data: provider } = await supabase
                .from("providers")
                .select("id")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (!provider) {
                // If not a provider, redirect
                router.push("/provider/onboarding");
                return;
            }

            setFormData(prev => ({ ...prev, provider_id: provider.id }));

            if (!isNew) {
                const { data: offer, error } = await supabase
                    .from("offers")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;
                if (offer) {
                    setFormData({
                        id: offer.id,
                        title: offer.title || "",
                        category: offer.category || NICHES[0],
                        description: offer.description || "",
                        exchange_type: offer.exchange_type || "free",
                        discount_percentage: offer.discount_percentage || "",
                        service_areas: offer.service_areas || [],
                        status: offer.status || "draft",
                        cover_url: offer.cover_url || "",
                        provider_id: provider.id,
                        quantity: offer.quantity || "",
                        deliverables: offer.deliverables || [],
                        timeline: offer.timeline || "",
                        style_requirements: offer.style_requirements || "",
                        required_tags: offer.required_tags || "",
                        restrictions: offer.restrictions || ""
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast("Failed to load offer data.", "error");
            router.push("/provider/offers");
        } finally {
            setLoading(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        if (file.size > 5 * 1024 * 1024) {
            showToast("Image must be less than 5MB", "error");
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            showToast("Only JPG, PNG, and WebP are allowed", "error");
            return;
        }

        setUploadingCover(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('offer-covers')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('offer-covers')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, cover_url: publicUrl }));
            showToast("Cover image uploaded!", "success");
        } catch (error: any) {
            console.error('Error uploading cover:', error);
            showToast("Failed to upload cover image.", "error");
        } finally {
            setUploadingCover(false);
        }
    };

    const addDeliverable = () => {
        setFormData(prev => ({
            ...prev,
            deliverables: [...prev.deliverables, { type: CONTENT_TYPES[0], count: 1 }]
        }));
    };

    const removeDeliverable = (index: number) => {
        setFormData(prev => ({
            ...prev,
            deliverables: prev.deliverables.filter((_, i) => i !== index)
        }));
    };

    const updateDeliverable = (index: number, field: keyof Deliverable, value: any) => {
        setFormData(prev => {
            const next = [...prev.deliverables];
            next[index] = { ...next[index], [field]: value };
            return { ...prev, deliverables: next };
        });
    };

    const calculateCompleteness = () => {
        const requiredFields = [
            formData.title,
            formData.category,
            formData.description,
            formData.deliverables.length > 0,
            formData.timeline,
            formData.service_areas.length > 0
        ];
        const completed = requiredFields.filter(f => !!f).length;
        return Math.round((completed / requiredFields.length) * 100);
    };

    const completeness = calculateCompleteness();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const dataToSave = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                exchange_type: formData.exchange_type,
                discount_percentage: formData.exchange_type === 'discount' ? formData.discount_percentage : null,
                service_areas: formData.service_areas,
                location_area: formData.service_areas[0] || null, // legacy support
                cover_url: formData.cover_url,
                provider_id: formData.provider_id,
                quantity: formData.quantity === "" ? null : parseInt(formData.quantity.toString()),
                deliverables: formData.deliverables,
                timeline: formData.timeline,
                style_requirements: formData.style_requirements,
                required_tags: formData.required_tags,
                restrictions: formData.restrictions,
                status: formData.status
            };

            if (isNew) {
                const { error } = await supabase.from("offers").insert(dataToSave);
                if (error) throw error;
                showToast("Offer created successfully!", "success");
            } else {
                const { error } = await supabase.from("offers").update(dataToSave).eq("id", params.id);
                if (error) throw error;
                showToast("Offer updated successfully!", "success");
            }

            router.push("/provider/offers");
        } catch (error: any) {
            console.error("Error saving offer:", error);
            showToast(error.message || "Failed to save offer.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this offer?")) return;
        setSaving(true);
        try {
            const { error } = await supabase.from("offers").delete().eq("id", params.id);
            if (error) throw error;
            router.push("/provider/offers");
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-0">
            {/* Nav & Header */}
            <div className="mb-10">
                <Link
                    href="/provider/offers"
                    className="mb-6 flex items-center gap-2 font-medium text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                    <MoveLeft className="h-4 w-4" />
                    Back to Offers
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900">
                            {isNew ? "Create New Offer" : "Edit Offer"}
                        </h1>
                        <p className="mt-1 text-lg text-gray-500">Set up a high-trust opportunity for creators.</p>
                    </div>
                    <div className="hidden flex-col items-end gap-1 md:flex">
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Core Branding */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Offer Identity</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Cover Upload */}
                        <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 transition-all hover:border-[#FF4D22]/20">
                            {formData.cover_url ? (
                                <>
                                    <img src={formData.cover_url} alt="Cover" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                </>
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                                    <ImageIcon className="mb-2 h-10 w-10 opacity-20" />
                                    <p className="text-sm font-bold">Upload Cover Image</p>
                                    <p className="text-xs">16:9 ratio, max 5MB</p>
                                </div>
                            )}

                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-gray-900 shadow-2xl">
                                    {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                                    <span>{formData.cover_url ? 'Change Image' : 'Select Image'}</span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Offer Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                    placeholder="e.g. Free HydroFacial for Lifestyle Creators"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                >
                                    {NICHES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Offer Status</label>
                                <div className="space-y-3">
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                    >
                                        <option value="draft">Draft (Private)</option>
                                        <option value="published">Published (Live)</option>
                                    </select>

                                    {formData.status === 'published' && completeness < 100 && (
                                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-xs font-medium">
                                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                            <p>Warning: This offer is incomplete. We recommend reaching 100% completion before publishing to maximize creator interest.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Exchange Rules */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <Target className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Exchange Rules</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Offer Description *</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5 min-h-[120px] resize-none"
                                placeholder="Explain exactly what the creator gets. Be descriptive about the service or product..."
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Deliverables *</label>
                                <button
                                    type="button"
                                    onClick={addDeliverable}
                                    className="text-xs font-bold text-[#FF4D22] hover:underline"
                                >
                                    + Add Deliverable
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.deliverables.map((del, index) => (
                                    <div key={index} className="flex items-center gap-2 group">
                                        <select
                                            value={del.type}
                                            onChange={(e) => updateDeliverable(index, 'type', e.target.value)}
                                            className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900"
                                        >
                                            {CONTENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
                                            value={del.count}
                                            onChange={(e) => updateDeliverable(index, 'count', parseInt(e.target.value))}
                                            className="w-20 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeDeliverable(index)}
                                            className="p-2 text-gray-300 hover:text-red-400"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {formData.deliverables.length === 0 && (
                                    <p className="text-[11px] text-gray-400 italic">No deliverables defined. What should the creator post?</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Posting Timeline *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.timeline}
                                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                        placeholder="e.g. Within 7 days of visit"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Must-Tag Accounts/Tags</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                    <input
                                        type="text"
                                        value={formData.required_tags}
                                        onChange={(e) => setFormData({ ...formData, required_tags: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                        placeholder="@yourbrand #torontofashion"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Restrictions / Notes</label>
                            <input
                                type="text"
                                value={formData.restrictions}
                                onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                placeholder="e.g. No competitor brand placements in background"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Location & Availability */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4D22]/10 text-[#FF4D22]">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Coverage & Availability</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">GTA Service Areas *</label>
                            <MultiSelect
                                options={GTA_LOCATIONS}
                                selected={formData.service_areas}
                                onChange={(selected) => setFormData(prev => ({ ...prev, service_areas: selected }))}
                                placeholder="Select the areas where this offer is available..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Spots Available (Optional)</label>
                                <input
                                    type="number"
                                    placeholder="No limit"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Exchange Type</label>
                                <select
                                    value={formData.exchange_type}
                                    onChange={(e) => setFormData({ ...formData, exchange_type: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#FF4D22]/20 focus:bg-white focus:ring-4 focus:ring-[#FF4D22]/5"
                                >
                                    <option value="free">Free Service</option>
                                    <option value="discount">Exclusive Discount</option>
                                    <option value="gifted">Gifted Product</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-8 z-10 flex items-center justify-between rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        {!isNew && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-50 text-red-500 transition-all hover:bg-red-50"
                                title="Delete Offer"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                        <div className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${completeness === 100 ? 'bg-green-500' : 'bg-gray-200'} text-white`}>
                                {completeness === 100 ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-bold text-gray-600">
                                {completeness === 100 ? 'Offer is perfect!' : `${100 - completeness}% more to go`}
                            </span>
                        </div>
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
                        <span>
                            {saving
                                ? 'Saving...'
                                : isNew
                                    ? (formData.status === 'published' ? 'Create & Publish' : 'Create Draft')
                                    : (formData.status === 'published' ? 'Save & Publish' : 'Save as Draft')
                            }
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
