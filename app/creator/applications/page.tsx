"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Loader2, Calendar, CheckCircle2, XCircle, Clock, MapPin, Building2, ExternalLink, X, Link as LinkIcon, Plus, Trash2, Eye, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ProfileImage from "@/components/ui/ProfileImage";
import FileUpload from "@/components/ui/FileUpload";


interface Application {
    id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
    created_at: string;
    initiator: 'creator' | 'provider';
    request_details: any;
    submitted_post_urls?: string[] | null;
    submitted_deliverables?: {
        label: string;
        url?: string;
        storage_path?: string;
        type?: 'video' | 'image'
    }[] | null;
    offer?: {
        title: string;
        category: string;
        deliverables: { type: string; count: number }[];
    };
    provider: {
        business_name: string;
        logo_url: string | null;
    }
}

export default function CreatorApplicationsPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [submissionData, setSubmissionData] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase
                .from("applications")
                .select(`
                    id,
                    status,
                    created_at,
                    initiator,
                    request_details,
                    submitted_post_urls,
                    submitted_deliverables,
                    offer:offers(
                        title, 
                        category,
                        deliverables
                    ),
                    provider:providers(business_name, logo_url)
                `)
                .eq("creator_id", user?.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setApplications(data as any || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
            showToast("Failed to fetch applications", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (app: Application) => {
        setSelectedApp(app);

        // Initialize submission data from deliverables or existing submission
        const initialData: Record<string, any> = {};

        if (app.submitted_deliverables?.length) {
            app.submitted_deliverables.forEach(d => {
                initialData[d.label] = d.storage_path ? { storage_path: d.storage_path, type: d.type } : d.url || "";
            });
        } else if (app.offer) {
            // Generate empty fields based on offer deliverables
            app.offer.deliverables.forEach(group => {
                const typeLabel = group.type || 'Deliverable';
                for (let i = 1; i <= group.count; i++) {
                    const label = group.count > 1 ? `${typeLabel} ${i}` : typeLabel;
                    initialData[label] = "";
                }
            });
        } else if (app.request_details?.deliverables) {
            // Generate fields for custom request deliverables
            app.request_details.deliverables.forEach((item: any) => {
                const typeLabel = item.type || 'Deliverable';
                const count = item.quantity || 1;
                for (let i = 1; i <= count; i++) {
                    const label = count > 1 ? `${typeLabel} ${i}` : typeLabel;
                    initialData[label] = "";
                }
            });
        }



        setShowDeleteConfirm(null);
        setSubmissionData(initialData);
        setShowModal(true);
    };

    const updateSubmission = (label: string, data: any) => {
        setSubmissionData(prev => ({
            ...prev,
            [label]: data
        }));
    };

    const clearSubmission = (label: string) => {
        setSubmissionData(prev => {
            const next = { ...prev };
            delete next[label];
            return next;
        });
    };

    const handleSubmitLinks = async () => {
        if (!selectedApp) return;

        const submissions = Object.entries(submissionData).map(([label, data]) => {
            if (typeof data === 'string') {
                return { label, url: data.trim() };
            }
            return { label, ...data };
        });

        const hasEmpty = submissions.some(s => !s.url && !s.storage_path);
        if (hasEmpty) {
            showToast("Please provide the required deliverables.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from("applications")
                .update({
                    submitted_deliverables: submissions,
                    status: 'completed'
                })
                .eq("id", selectedApp.id);

            if (error) throw error;

            // Update local state
            setApplications(prev => prev.map(app =>
                app.id === selectedApp.id ? { ...app, submitted_deliverables: submissions, status: 'completed' } : app
            ));
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting deliverables:", error);
            showToast("Failed to submit deliverables. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubmission = async (label: string) => {
        if (!selectedApp || !selectedApp.submitted_deliverables) return;

        const itemToDelete = selectedApp.submitted_deliverables.find(d => d.label === label);
        if (!itemToDelete) return;

        setDeleting(label);
        try {
            // 1. Delete file from storage if it exists
            if (itemToDelete.storage_path) {
                const { error: storageError } = await supabase.storage
                    .from('connex-deliverables')
                    .remove([itemToDelete.storage_path]);

                if (storageError) {
                    console.error("Error deleting file:", storageError);
                    // Continue anyway to clean up DB record
                }
            }

            // 2. Update Application record (Remove item + Set status to in_progress)
            const newDeliverables = selectedApp.submitted_deliverables.filter(d => d.label !== label);

            const { error: dbError } = await supabase
                .from("applications")
                .update({
                    submitted_deliverables: newDeliverables.length > 0 ? newDeliverables : null,
                    status: 'in_progress'
                })
                .eq("id", selectedApp.id);

            if (dbError) throw dbError;

            // 3. Update Local State
            setApplications(prev => prev.map(app =>
                app.id === selectedApp.id ? {
                    ...app,
                    submitted_deliverables: newDeliverables.length > 0 ? newDeliverables : null,
                    status: 'in_progress'
                } : app
            ));

            // 4. Update Modal State
            // If we deleted the last item, switch to clean submission view
            // If not, we are now in 'in_progress', so form should appear with remaining items pre-filled
            // We need to re-initialize the submission form with the remaining data
            const remainingData: Record<string, any> = {};

            // Re-populate from remaining deliverables
            newDeliverables.forEach(d => {
                remainingData[d.label] = d.storage_path ? { storage_path: d.storage_path, type: d.type } : d.url || "";
            });

            // Identify missing deliverables that need to be filled
            if (selectedApp.offer) {
                selectedApp.offer.deliverables.forEach(group => {
                    const typeLabel = group.type || 'Deliverable';
                    for (let i = 1; i <= group.count; i++) {
                        const l = group.count > 1 ? `${typeLabel} ${i}` : typeLabel;
                        if (!remainingData[l]) {
                            remainingData[l] = ""; // Initialize empty field
                        }
                    }
                });
            } else if (selectedApp.request_details?.deliverables) {
                selectedApp.request_details.deliverables.forEach((item: any) => {
                    const typeLabel = item.type || 'Deliverable';
                    const count = item.quantity || 1;
                    for (let i = 1; i <= count; i++) {
                        const l = count > 1 ? `${typeLabel} ${i}` : typeLabel;
                        if (!remainingData[l]) {
                            remainingData[l] = ""; // Initialize empty field
                        }
                    }
                });
            }

            setSubmissionData(remainingData);

            // Update selectedApp locally to reflect status change immediately in modal
            setSelectedApp(prev => prev ? {
                ...prev,
                submitted_deliverables: newDeliverables.length > 0 ? newDeliverables : null,
                status: 'in_progress'
            } : null);

            setShowDeleteConfirm(null);
            showToast("Submission deleted", "success");

        } catch (error) {
            console.error("Error deleting submission:", error);
            showToast("Failed to delete submission", "error");
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Applications</h1>
                    <p className="text-gray-500 mt-1 font-medium">Track the status of your offers</p>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        You haven't applied to any offers yet. Browse the marketplace to find collaborations.
                    </p>
                    <Link
                        href="/creator/offers"
                        className="inline-flex items-center justify-center px-6 py-3 mt-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Browse Offers
                    </Link>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* 1. NEW: Requests Section (Inbound & Pending Only) */}
                    {Object.keys(
                        applications
                            .filter(app => app.status === 'pending' && app.initiator === 'provider')
                            .reduce((acc, app) => {
                                const title = app.offer?.title || app.request_details?.title || "Direct Requests";
                                if (!acc[title]) acc[title] = [];
                                acc[title].push(app);
                                return acc;
                            }, {} as Record<string, Application[]>)
                    ).length > 0 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Requests</h2>
                                    <p className="text-sm text-gray-500 font-medium">Inbound requests awaiting your response</p>
                                </div>

                                {Object.entries(
                                    applications
                                        .filter(app => app.status === 'pending' && app.initiator === 'provider')
                                        .reduce((acc, app) => {
                                            const title = app.offer?.title || app.request_details?.title || "Direct Requests";
                                            if (!acc[title]) acc[title] = [];
                                            acc[title].push(app);
                                            return acc;
                                        }, {} as Record<string, Application[]>)
                                ).map(([title, apps]) => (
                                    <div key={title} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                        <div className="w-full flex items-center justify-between p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-primary/5 border border-primary/10">
                                                    <Building2 className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900">{title}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{apps.length} {apps.length === 1 ? 'Request' : 'Requests'}</span>
                                                        <span className="w-1 h-1 rounded-full bg-primary/30" />
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Action Required</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0">
                                            <div className="h-px bg-gray-100/60 mb-6" />
                                            <div className="space-y-3">
                                                {apps.map((app) => (
                                                    <div key={app.id} className="relative group/row">
                                                        <div className="bg-gray-50/60 rounded-[2rem] border border-transparent transition-all duration-300 hover:bg-white hover:border-gray-200 hover:shadow-lg overflow-hidden">
                                                            <div className="flex flex-col lg:flex-row items-center gap-4 p-4 lg:p-5">
                                                                {/* Provider Info */}
                                                                <div className="flex items-center gap-4 w-full lg:w-1/3">
                                                                    <ProfileImage
                                                                        src={app.provider?.logo_url}
                                                                        name={app.provider?.business_name || "Unknown Provider"}
                                                                        type="provider"
                                                                        className="w-12 h-12 ring-2 ring-white shadow-sm"
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-sm font-bold text-gray-900 truncate">{app.provider?.business_name || "Unknown Provider"}</p>
                                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sent {formatDate(app.created_at)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Offer/Details */}
                                                                <div className="w-full lg:w-1/3 border-t lg:border-t-0 pt-3 lg:pt-0 lg:px-4">
                                                                    <p className="text-xs font-bold text-gray-600 line-clamp-1">
                                                                        {app.offer?.category || app.request_details?.category || "Collaboration Request"}
                                                                    </p>
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 block">
                                                                        Review details before accepting
                                                                    </span>
                                                                </div>

                                                                {/* Actions */}
                                                                <div className="w-full lg:w-1/3 flex items-center justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                                                                    <button
                                                                        type="button"
                                                                        className="flex-1 lg:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-500 text-[10px] font-black rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-200 uppercase tracking-wider transition-colors shadow-sm"
                                                                        onClick={async (e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            try {
                                                                                const { error } = await supabase.from('applications').update({ status: 'rejected' }).eq('id', app.id);
                                                                                if (error) throw error;
                                                                                setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a));
                                                                                showToast("Request declined", "success");
                                                                            } catch (error: any) {
                                                                                console.error("Decline error:", error);
                                                                                showToast(error.message || "Failed to decline", "error");
                                                                            }
                                                                        }}
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="flex-1 lg:flex-none px-5 py-2 bg-gray-900 text-white text-[10px] font-black rounded-full shadow-lg hover:bg-black uppercase tracking-wider transition-colors"
                                                                        onClick={async (e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            try {
                                                                                const { error } = await supabase.from('applications').update({ status: 'in_progress' }).eq('id', app.id);
                                                                                if (error) throw error;
                                                                                setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'in_progress' } : a));
                                                                                showToast("Request accepted!", "success");
                                                                            } catch (error: any) {
                                                                                console.error("Accept error:", error);
                                                                                showToast(error.message || "Failed to accept", "error");
                                                                            }
                                                                        }}
                                                                    >
                                                                        Accept Request
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    {/* 2. EXISTING: Projects Section (Everything Else) */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Projects</h2>
                            <p className="text-sm text-gray-500 font-medium">Ongoing and completed collaborations</p>
                        </div>

                        <div className="space-y-6">
                            {/* Stable Header Row - Only show if there are projects */}
                            {applications.filter(app => !(app.status === 'pending' && app.initiator === 'provider')).length > 0 && (
                                <div className="hidden lg:grid grid-cols-12 gap-x-4 px-6 pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-2">Provider</div>
                                    <div className="col-span-3">Offer Details</div>
                                    <div className="col-span-2 text-center">Proof of Work</div>
                                    <div className="col-span-2 text-center">Status</div>
                                    <div className="col-span-2 text-right pr-4">Applied Date</div>
                                </div>
                            )}

                            {applications.filter(app => !(app.status === 'pending' && app.initiator === 'provider')).map((app) => (
                                <div key={app.id} className="relative group/row">
                                    <div className="bg-gray-50/60 rounded-[2.5rem] border border-transparent transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white hover:border-gray-200 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden">
                                        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-6 lg:gap-x-6 items-center p-6 lg:px-2 py-4 lg:py-3">
                                            {/* 1. Logo & Provider (Grouped on mobile) */}
                                            <div className="lg:col-span-3 flex lg:contents items-center gap-4 w-full">
                                                <div className="lg:col-span-1 flex justify-center shrink-0">
                                                    <ProfileImage
                                                        src={app.provider?.logo_url}
                                                        name={app.provider?.business_name || "Unknown Provider"}
                                                        type="provider"
                                                        className="w-14 h-14 ring-2 ring-white shadow-sm"
                                                    />
                                                </div>

                                                <div className="lg:col-span-2 min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-gray-900 truncate" title={app.provider?.business_name}>{app.provider?.business_name || "Unknown Provider"}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Offer Details */}
                                            <div className="lg:col-span-3 min-w-0 w-full border-t lg:border-t-0 pt-4 lg:pt-0">
                                                <p className="text-sm font-bold text-gray-900 truncate group-hover/row:text-primary transition-colors" title={app.offer?.title || app.request_details?.title}>
                                                    {app.offer?.title || app.request_details?.title || "Project Request"}
                                                </p>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 block">
                                                    {app.offer?.category || "Direct Request"}
                                                </span>
                                            </div>

                                            {/* 3. Proof of Work / Status Actions */}
                                            <div className="lg:col-span-2 flex justify-start lg:justify-center w-full">
                                                {app.status === 'in_progress' ? (
                                                    <button
                                                        onClick={() => handleOpenModal(app)}
                                                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all uppercase tracking-wider active:scale-95"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Submit Proof
                                                    </button>
                                                ) : app.submitted_deliverables?.length || app.submitted_post_urls?.length ? (
                                                    <button
                                                        onClick={() => handleOpenModal(app)}
                                                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-primary text-[10px] font-black rounded-full shadow-sm hover:bg-primary/5 transition-all uppercase tracking-wider group/btn"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover/btn:animate-pulse" />
                                                        View Submission
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 lg:contents">
                                                        <span className="lg:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest">Deliverables:</span>
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                                                            {app.status === 'pending' ? 'Pending Acceptance' : 'Not Started'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 4. Status Badge */}
                                            <div className="lg:col-span-2 flex justify-start lg:justify-center w-full">
                                                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 border shadow-sm transition-all duration-300 w-full lg:w-auto
                                            ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        app.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            app.status === 'completed' ? 'bg-primary/5 text-primary border-primary/10' :
                                                                app.status === 'pending' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                                                    'bg-red-50 text-red-500 border-red-100'}
                                        `}>
                                                    {app.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> :
                                                        app.status === 'in_progress' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                                            app.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                                                app.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                                    <XCircle className="w-3 h-3" />}
                                                    {app.status === 'in_progress' ? 'In Progress' : app.status === 'pending' ? 'Applied' : app.status}
                                                </div>
                                            </div>

                                            {/* 5. Applied Date */}
                                            <div className="lg:col-span-2 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center w-full lg:text-right lg:mr-7">
                                                <p className="text-sm font-bold text-gray-900">{formatDate(app.created_at)}</p>
                                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                                    <Calendar className="w-3 h-3 text-gray-300" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {app.status === 'accepted' ? 'Confirmed' : 'Applied'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {applications.filter(app => !(app.status === 'pending' && app.initiator === 'provider')).length === 0 && (
                                <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-gray-100/50 border-dashed">
                                    <p className="text-sm text-gray-400 font-medium">No active or completed projects.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Modal */}
            {showModal && (
                <div className="fixed -inset-20 inset-x-0  z-[100] flex items-center justify-center p-4 min-h-[100%] w-screen">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/0 backdrop-blur-[10px] animate-in fade-in duration-300"
                        onClick={() => setShowModal(false)}
                    />

                    {/* popup */}
                    <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] overflow-hidden flex flex-col">

                        <div className="p-8 pb-0 shrink-0">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                }}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <LinkIcon className="w-7 h-7 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedApp?.status === 'in_progress' ? 'Submit Proof of Work' : 'Managed Submissions'}
                                </h2>
                                <p className="text-gray-500">
                                    {selectedApp?.status === 'in_progress'
                                        ? 'Upload and submit your deliverables. You can delete or edit them later.'
                                        : 'Review your submitted content. Delete items to edit or re-upload.'}
                                </p>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 pt-0 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-6">
                                {/* Form / List */}
                                <div className="space-y-4">
                                    {selectedApp?.status === 'in_progress' ? (
                                        // IN PROGRESS: Show Form with Uploads
                                        Object.keys(submissionData).length > 0 ? (
                                            Object.keys(submissionData).map((label) => (
                                                <FileUpload
                                                    key={label}
                                                    label={label}
                                                    applicationId={selectedApp?.id || ""}
                                                    onUploadComplete={(data) => updateSubmission(label, {
                                                        storage_path: data.storage_path,
                                                        type: data.type
                                                    })}
                                                    onClear={() => clearSubmission(label)}
                                                    initialValue={selectedApp?.submitted_deliverables?.find(d => d.label === label) as any}
                                                    disabled={selectedApp?.status !== 'in_progress'}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-center text-sm text-gray-400 italic py-4">
                                                No specific deliverables defined. Please contact the provider.
                                            </p>
                                        )
                                    ) : (
                                        // COMPLETED: Show Management List (Delete Only)
                                        <div className="space-y-3 pt-2">
                                            {selectedApp?.submitted_deliverables?.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] group hover:bg-white hover:shadow-lg hover:border-gray-100 transition-all duration-300"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4 overflow-hidden flex-1">
                                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                                                                {item.type === 'video' ? <Eye className="w-5 h-5 text-indigo-500" /> : <Eye className="w-5 h-5 text-primary" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                                    {item.storage_path ? (item.type === 'video' ? 'Video Submission' : 'Image Submission') : item.url}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {showDeleteConfirm === item.label ? (
                                                            <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200">
                                                                <button
                                                                    onClick={() => setShowDeleteConfirm(null)}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-200"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteSubmission(item.label)}
                                                                    disabled={deleting === item.label}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 shadow-sm flex items-center gap-1.5"
                                                                >
                                                                    {deleting === item.label ? <Loader2 className="w-3 h-3 animate-spin bg-white/20" /> : <Trash2 className="w-3 h-3" />}
                                                                    Confirm
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(item.label)}
                                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                title="Delete submission"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Legacy URL support */}
                                            {selectedApp?.submitted_post_urls?.map((url, i) => (
                                                <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-bold text-gray-600 truncate">{url}</span>
                                                    </div>
                                                    <a href={url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline">Open</a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedApp?.status === 'in_progress' && (
                                    <button
                                        onClick={handleSubmitLinks}
                                        disabled={submitting || Object.keys(submissionData).length === 0}
                                        className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit All Deliverables'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
