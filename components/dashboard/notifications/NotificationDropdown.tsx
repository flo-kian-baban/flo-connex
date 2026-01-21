"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NotificationItem from "./NotificationItem";

interface Notification {
    id: string;
    type: 'chat_message' | 'application_status' | 'deliverable_submitted' | 'profile_incomplete';
    title: string;
    body: string | null;
    created_at: string;
    is_read: boolean;
    conversation_id: string | null;
    application_id: string | null;
    offer_id: string | null;
}

interface NotificationDropdownProps {
    userId: string;
}

export default function NotificationDropdown({ userId }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('recipient_user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount(data?.filter(n => !n.is_read).length || 0);
        } catch (error: any) {
            // Only log if it's not an abort error
            if (error?.name !== 'AbortError') {
                console.error('Error fetching notifications:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId);

            if (error) throw error;

            // Update local state
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, is_read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            // If it was unread, decrease count
            const wasUnread = notifications.find(n => n.id === notificationId && !n.is_read);
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) {
                // Revert on error (optional, but good practice. For now simple logging)
                console.error('Error deleting notification:', error);
                fetchNotifications(); // Refetch to sync state
            }
        } catch (error) {
            console.error('Error handling notification deletion:', error);
        }
    };

    // Subscribe to realtime notifications
    useEffect(() => {
        if (!userId) return;

        fetchNotifications();

        const channel = supabase
            .channel(`notifications:${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_user_id=eq.${userId}`
            }, (payload) => {
                const newNotification = payload.new as Notification;
                setNotifications(prev => [newNotification, ...prev].slice(0, 20));
                setUnreadCount(prev => prev + 1);
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_user_id=eq.${userId}`
            }, (payload) => {
                const updatedNotification = payload.new as Notification;
                setNotifications(prev => prev.map(n =>
                    n.id === updatedNotification.id ? updatedNotification : n
                ));

                // Recalculate unread count
                setNotifications(current => {
                    setUnreadCount(current.filter(n => !n.is_read).length);
                    return current;
                });
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_user_id=eq.${userId}`
            }, (payload) => {
                const deletedId = payload.old.id;
                setNotifications(prev => prev.filter(n => n.id !== deletedId));
            })
            .subscribe();

        return () => {
            console.log('🔔 Unsubscribing from notifications');
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-4 bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-primary transition-all rounded-full shadow-sm group"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-3 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[32rem] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
                                <p className="text-xs text-gray-400 mt-1">We'll notify you when something happens</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        id={notification.id}
                                        type={notification.type}
                                        title={notification.title}
                                        body={notification.body}
                                        createdAt={notification.created_at}
                                        isRead={notification.is_read}
                                        conversationId={notification.conversation_id}
                                        applicationId={notification.application_id}
                                        offerId={notification.offer_id}
                                        onMarkAsRead={markAsRead}
                                        onDelete={deleteNotification}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
