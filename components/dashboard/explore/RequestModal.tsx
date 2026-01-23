"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Calendar, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import Dropdown from "@/components/ui/Dropdown";
import { PLATFORMS, CONTENT_TYPES } from "@/lib/constants";

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    creator: {
        id: string; // user_id
        display_name: string;
    } | null;
}

export default function RequestModal({ isOpen, onClose, creator }: RequestModalProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [brief, setBrief] = useState("");
    const [platform, setPlatform] = useState("");
    const [deliverableType, setDeliverableType] = useState("");
    const [deliverableQuantity, setDeliverableQuantity] = useState("1");
    const [deadline, setDeadline] = useState("");

    // Offers for optional selection
    const [offers, setOffers] = useState<{ label: string, value: string }[]>([]);
    const [selectedOfferId, setSelectedOfferId] = useState("");

    useEffect(() => {
        if (isOpen && user) {
            fetchProviderOffers();
        }
    }, [isOpen, user]);

    const fetchProviderOffers = async () => {
        // Fetch active offers belonging to this provider to populate the dropdown
        try {
            // First get provider id
            const { data: provider } = await supabase
                .from("providers")
                .select("id")
                .eq("claimed_by_user_id", user?.id)
                .single();

            if (provider) {
                const { data: offersData } = await supabase
                    .from("offers")
                    .select("id, title")
                    .eq("provider_id", provider.id)
                    .eq("status", "active");

                if (offersData) {
                    setOffers(offersData.map(o => ({ label: o.title, value: o.id })));
                }
            }
        } catch (err) {
            console.error("Error fetching offers:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!creator || !user) return;

        if (!title || !brief || !platform || !deadline) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        try {
            setLoading(true);

            // Get provider ID
            const { data: provider } = await supabase
                .from("providers")
                .select("id")
                .eq("claimed_by_user_id", user.id)
                .single();

            if (!provider) throw new Error("Provider profile not found");

            const requestDetails = {
                title,
                brief,
                platform,
                deadline,
                deliverables: [{
                    type: deliverableType || "content",
                    quantity: parseInt(deliverableQuantity) || 1
                }]
            };

            const payload = {
                provider_id: provider.id,
                creator_id: creator.id,
                offer_id: selectedOfferId || null,
                initiator: "provider",
                status: "pending", // Waiting for creator acceptance
                request_details: requestDetails
            };

            const { error } = await supabase
                .from("applications")
                .insert(payload);

            if (error) throw error;

            showToast("Request sent successfully!", "success");
            onClose();
            // Reset form
            setTitle("");
            setBrief("");
            setPlatform("");
            setDeadline("");
            setSelectedOfferId("");

        } catch (err) {
            console.error("Error sending request:", err);
            showToast("Failed to send request. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Send Request</h2>
                        <p className="text-sm text-gray-500 font-medium">to {creator?.display_name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Offer Selection (Optional) */}
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Link to Offer (Optional)</label>
                        <Dropdown
                            options={[{ label: "Custom Request (No Offer)", value: "" }, ...offers]}
                            value={selectedOfferId}
                            onChange={(val) => setSelectedOfferId(val)}
                            placeholder="Select an active offer..."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Request Title *</label>
                            <input
                                type="text"
                                placeholder="e.g. Summer Campaign UGC Video"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/5 outline-none font-bold placeholder:font-normal transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Platform *</label>
                                <Dropdown
                                    options={PLATFORMS.map(p => ({ label: p, value: p }))}
                                    value={platform}
                                    onChange={setPlatform}
                                    placeholder="Select platform"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Deadline *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/5 outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Deliverable Type</label>
                                <Dropdown
                                    options={CONTENT_TYPES.map(c => ({ label: c, value: c }))}
                                    value={deliverableType}
                                    onChange={setDeliverableType}
                                    placeholder="e.g. Video 9:16"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={deliverableQuantity}
                                    onChange={(e) => setDeliverableQuantity(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/5 outline-none font-bold text-center"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Project Brief *</label>
                            <textarea
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                                placeholder="Describe what you need, brand guidelines, key messaging, etc."
                                className="w-full h-32 p-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/5 outline-none font-medium resize-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            Once sent, the creator will review your request. If accepted, you'll be able to chat and manage the project directly in your dashboard.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-gray-900 rounded-2xl text-white font-black hover:bg-black transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Request"}
                    </button>
                </form>
            </div>
        </div>
    );
}
