"use client";

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/toast-context';
import { Upload, X, Video, Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
    label: string;
    applicationId: string;
    onUploadComplete: (data: { label: string; storage_path: string; type: 'video' | 'image' }) => void;
    onClear: () => void;
    initialValue?: { storage_path: string; label: string; type?: string };
    disabled?: boolean;
}

export default function FileUpload({ label, applicationId, onUploadComplete, onClear, initialValue, disabled }: FileUploadProps) {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileMeta, setFileMeta] = useState<{ name: string; type: string } | null>(
        initialValue ? { name: initialValue.label, type: initialValue.type || 'unknown' } : null
    );
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
            setError('Please upload an image or video file.');
            return;
        }

        // Validate file size (100MB limit)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size exceeds 100MB limit.');
            return;
        }

        setUploading(true);
        setError(null);
        setFileMeta({ name: file.name, type });
        setProgress(0);

        try {
            // Get session token
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('You must be logged in to upload files');
            }

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('applicationId', applicationId);
            formData.append('deliverableLabel', label);

            // Upload with progress tracking using XMLHttpRequest
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    setUploading(false);
                    onUploadComplete({
                        label,
                        storage_path: response.storage_path,
                        type: type as 'video' | 'image'
                    });
                    showToast(`${type === 'video' ? 'Video' : 'Image'} uploaded successfully`, "success");
                } else {
                    const errorResponse = JSON.parse(xhr.responseText);
                    throw new Error(errorResponse.error || 'Upload failed');
                }
            });

            xhr.addEventListener('error', () => {
                throw new Error('Network error during upload');
            });

            xhr.open('POST', '/api/deliverables/upload');
            xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
            xhr.send(formData);

        } catch (error: any) {
            console.error('Upload failed:', error);
            setError(error.message || 'Upload failed. Please try again.');
            showToast("Upload failed", "error");
            setUploading(false);
            setFileMeta(null);
            setProgress(0);
        }
    };

    const clearFile = () => {
        setFileMeta(null);
        setProgress(0);
        setError(null);
        onClear();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
            )}

            <div className={`relative min-h-[80px] flex items-center justify-between p-4 bg-gray-50 border rounded-2xl transition-all ${uploading ? 'border-primary/50' : fileMeta ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100'
                }`}>
                {!fileMeta && !uploading ? (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="w-full flex items-center gap-3 text-gray-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className="text-sm font-bold block">
                                Click to upload video or image
                            </span>
                            <span className="text-[10px] font-medium text-gray-400">Max 100MB</span>
                        </div>
                    </button>
                ) : (
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${fileMeta?.type === 'video' ? 'bg-indigo-50 text-indigo-500' : 'bg-primary/10 text-primary'
                            }`}>
                            {fileMeta?.type === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-900 truncate">{fileMeta?.name}</p>
                            {uploading ? (
                                <div className="mt-1.5 flex items-center gap-3">
                                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-primary uppercase shrink-0">{progress}%</span>
                                </div>
                            ) : (
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Ready to submit</p>
                            )}
                        </div>
                    </div>
                )}

                {fileMeta && !uploading && !disabled && (
                    <button
                        onClick={clearFile}
                        className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="video/*,image/*"
                />
            </div>
        </div>
    );
}
