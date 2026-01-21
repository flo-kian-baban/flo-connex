"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, Maximize2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MediaPreviewProps {
    storagePath: string;
    type: 'video' | 'image' | string;
    applicationId: string;
    maxHeight?: string;
}

export default function MediaPreview({ storagePath, type, applicationId, maxHeight = '70vh' }: MediaPreviewProps) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number; ratio: number } | null>(null);
    const [metadataLoaded, setMetadataLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchSignedUrl = async () => {
            try {
                setLoading(true);
                setError(null);
                setMetadataLoaded(false);

                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('You must be logged in to view this content');
                }

                const response = await fetch('/api/deliverables/signed-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        storage_path: storagePath,
                        application_id: applicationId
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to load media preview');
                }

                const data = await response.json();
                setUrl(data.signedUrl);
            } catch (err: any) {
                console.error('Error fetching signed URL:', err);
                setError(err.message || 'Failed to load media preview');
            } finally {
                setLoading(false);
            }
        };

        if (storagePath && applicationId) {
            fetchSignedUrl();
        }
    }, [storagePath, applicationId]);

    // Fallback: Ensure media is shown after 5 seconds if URL is available but metadata hasn't loaded
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (url && !metadataLoaded) {
            timeout = setTimeout(() => {
                console.log('Metadata loading fallback triggered');
                setMetadataLoaded(true);
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [url, metadataLoaded]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setDimensions({
            width: naturalWidth,
            height: naturalHeight,
            ratio: naturalWidth / naturalHeight
        });
        setMetadataLoaded(true);
    };

    const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const { videoWidth, videoHeight } = e.currentTarget;
        if (videoWidth > 0) {
            setDimensions({
                width: videoWidth,
                height: videoHeight,
                ratio: videoWidth / videoHeight
            });
        }
        setMetadataLoaded(true);
    };

    if (loading) {
        return (
            <div className="w-full h-[400px] bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin text-[#FF4D22] mb-2" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Preview...</p>
            </div>
        );
    }

    if (error || !url) {
        return (
            <div className="w-full h-[400px] bg-red-50 rounded-2xl flex flex-col items-center justify-center border border-red-100 p-6 text-center">
                <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Preview Unavailable</p>
                <p className="text-[10px] font-medium text-red-400">{error || 'Failed to load media'}</p>
            </div>
        );
    }

    const containerStyle = {
        maxHeight: maxHeight,
        maxWidth: '100%',
        margin: '0 auto',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.01)',
        backgroundColor: 'transparent' // Removed black background
    };

    if (type === 'video') {
        // Default to 16:9 if dimensions not yet loaded, but opacity will hide it anyway
        const ratio = dimensions?.ratio || 16 / 9;

        // Determine closest target aspect ratio class for cleaner styling
        // (though inline style is used for exact fit)

        return (
            <div className="flex justify-center w-full relative">
                {!metadataLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50/50 rounded-3xl h-[300px] w-full border border-gray-100">
                        <Loader2 className="w-8 h-8 animate-spin text-[#FF4D22] mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Video...</p>
                    </div>
                )}

                <div
                    className={`relative transition-all duration-700 ease-in-out ${metadataLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{
                        ...containerStyle,
                        width: 'auto',
                        aspectRatio: `${ratio}`,
                    }}
                >
                    <video
                        ref={videoRef}
                        src={url}
                        className="w-full h-full object-cover" // Ensure it fills the container
                        controls
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={handleVideoMetadata}
                        onCanPlay={() => setMetadataLoaded(true)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full relative">
            {!metadataLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50/50 rounded-3xl h-[300px] w-full border border-gray-100">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FF4D22] mb-4" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Image...</p>
                </div>
            )}
            <div
                className={`relative group transition-all duration-700 ease-in-out ${metadataLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                    maxHeight: maxHeight,
                    maxWidth: '100%',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.01)',
                    backgroundColor: '#fff'
                }}
            >
                <img
                    src={url}
                    alt="Deliverable preview"
                    onLoad={handleImageLoad}
                    className="w-full h-full object-cover" // Intentional cover as requested
                    style={{ maxHeight: maxHeight }}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white rounded-xl text-gray-900 shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-black text-xs tracking-widest uppercase transform translate-y-2 group-hover:translate-y-0 duration-300"
                    >
                        <Maximize2 className="w-4 h-4" />
                        Expand
                    </a>
                </div>
            </div>
        </div>
    );
}
