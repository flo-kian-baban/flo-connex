"use client";

import { MessageSquare, FileCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
    id: string;
    type: 'chat_message' | 'application_status' | 'deliverable_submitted' | 'profile_incomplete';
    title: string;
    body: string | null;
    createdAt: string;
    isRead: boolean;
    conversationId?: string | null;
    applicationId?: string | null;
    offerId?: string | null;
    onMarkAsRead: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function NotificationItem({
    id,
    type,
    title,
    body,
    createdAt,
    isRead,
    conversationId,
    applicationId,
    offerId,
    onMarkAsRead,
    onDelete
}: NotificationItemProps) {
    const router = useRouter();

    const getIcon = () => {
        switch (type) {
            case 'chat_message':
                return <MessageSquare className="w-5 h-5 text-primary" />;
            case 'application_status':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'deliverable_submitted':
                return <FileCheck className="w-5 h-5 text-blue-500" />;
            case 'profile_incomplete':
                return <AlertCircle className="w-5 h-5 text-orange-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getNavigationUrl = () => {
        switch (type) {
            case 'chat_message':
                return applicationId ? `/chats?applicationId=${applicationId}` : '/chats';
            case 'application_status':
                return '/creator/applications';
            case 'deliverable_submitted':
                return '/provider/applications';
            case 'profile_incomplete':
                // Determine based on user type - will be handled by router
                return '/creator/profile'; // Default, can be overridden
            default:
                return '/';
        }
    };

    const getRelativeTime = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d`;
        return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleClick = () => {
        if (onDelete) {
            onDelete(id);
        } else {
            onMarkAsRead(id);
        }
        router.push(getNavigationUrl());
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-gray-50 text-left ${!isRead ? 'bg-orange-50/30' : ''
                }`}
        >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
                {getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h4 className={`text-sm font-semibold truncate ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {title}
                    </h4>
                    {!isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5"></div>
                    )}
                </div>
                {body && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                        {body}
                    </p>
                )}
                <span className="text-[10px] text-gray-400 font-medium">
                    {getRelativeTime(createdAt)}
                </span>
            </div>
        </button>
    );
}
