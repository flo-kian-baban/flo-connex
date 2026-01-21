"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Send, Search, User, MoreVertical, Phone, Video, Loader2, MessageSquare, LayoutGrid, FileText, Settings, Compass, ClipboardCheck } from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";
import DashboardShell, { NavItem } from "@/components/dashboard/layout/DashboardShell";

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

interface Conversation {
    id: string;
    application_id: string;
    provider_user_id: string;
    creator_user_id: string;
    last_message_at: string;
    other_user: {
        id: string;
        name: string;
        avatar_url: string | null;
        type: 'provider' | 'creator';
    } | null;
    last_message?: string;
    unread_count: number;
}

function ChatsContent() {
    const { user, userType, profile: authProfile } = useAuth();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const applicationId = searchParams.get('applicationId');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Refs to access latest state inside subscription callback
    const userRef = useRef(user);
    const selectedChatRef = useRef(selectedChat);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    useEffect(() => {
        if (selectedChat?.id) {
            fetchMessages(selectedChat.id);
            markAsRead(selectedChat.id);
            const unsubscribe = subscribeToMessages(selectedChat.id);
            return () => {
                unsubscribe();
            };
        }
    }, [selectedChat?.id]);

    // Handle deep-linking via applicationId
    useEffect(() => {
        const handleDeepLink = async () => {
            if (!applicationId || conversations.length === 0) return;

            // 1. Try direct match (fast path)
            const exactMatch = conversations.find(c => c.application_id === applicationId);
            if (exactMatch) {
                if (exactMatch.id !== selectedChat?.id) {
                    setSelectedChat(exactMatch);
                }
                return;
            }

            // 2. If no exact match (possibly an older application for an existing thread), resolve via user IDs
            try {
                const { data: appData, error } = await supabase
                    .from('applications')
                    .select(`
                        creator_id,
                        offer:offers!inner(provider_id)
                    `)
                    .eq('id', applicationId)
                    .single();

                if (error || !appData) return;

                const app = appData as any;
                const creatorId = app.creator_id;
                const providerId = app.offer.provider_id;

                // Find conversation between these two
                const conversationMatch = conversations.find(c =>
                    (c.creator_user_id === creatorId && c.provider_user_id === providerId) ||
                    (c.creator_user_id === providerId && c.provider_user_id === creatorId) // Safety for any role reversal
                );

                if (conversationMatch && conversationMatch.id !== selectedChat?.id) {
                    setSelectedChat(conversationMatch);
                }
            } catch (err) {
                console.error("Error resolving deep link:", err);
            }
        };

        handleDeepLink();
    }, [applicationId, conversations]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const markAsRead = async (conversationId: string) => {
        if (!user) return;

        // Optimistic local update
        setConversations(prev => prev.map(c =>
            c.id === conversationId ? { ...c, unread_count: 0 } : c
        ));

        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id)
            .eq('is_read', false);

        if (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    application:applications!inner(status)
                `)
                .or(`provider_user_id.eq.${user?.id},creator_user_id.eq.${user?.id}`)
                .neq('applications.status', 'pending')
                .order("last_message_at", { ascending: false });

            if (error) throw error;

            const enrichedConversations = await Promise.all(data.map(async (conv) => {
                const otherUserId = conv.provider_user_id === user?.id ? conv.creator_user_id : conv.provider_user_id;
                const otherUserType = conv.provider_user_id === user?.id ? 'creator' : 'provider';

                let otherUserData = {
                    id: otherUserId,
                    name: "Unknown User",
                    avatar_url: null as string | null,
                    type: otherUserType as 'provider' | 'creator'
                };

                // Fetch details based on type
                if (otherUserType === 'provider') {
                    const { data: pData } = await supabase
                        .from('providers')
                        .select('business_name, logo_url')
                        .eq('claimed_by_user_id', otherUserId)
                        .single();
                    if (pData) {
                        otherUserData.name = pData.business_name;
                        otherUserData.avatar_url = pData.logo_url;
                    }
                } else {
                    const { data: cData } = await supabase
                        .from('creator_profiles')
                        .select('display_name, avatar_url')
                        .eq('user_id', otherUserId)
                        .single();
                    if (cData) {
                        otherUserData.name = cData.display_name || "Creator";
                        otherUserData.avatar_url = cData.avatar_url;
                    }
                }

                // Fetch last message content
                const { data: lastMsg } = await supabase
                    .from('messages')
                    .select('content')
                    .eq('conversation_id', conv.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // Fetch unread count
                const { count: unreadCount } = await supabase
                    .from('messages')
                    .select('id', { count: 'exact', head: true })
                    .eq('conversation_id', conv.id)
                    .eq('is_read', false)
                    .neq('sender_id', user?.id || '');

                return {
                    ...conv,
                    other_user: otherUserData,
                    last_message: lastMsg?.content || "No messages yet",
                    unread_count: unreadCount || 0
                };
            }));

            setConversations(enrichedConversations);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            showToast("Failed to load conversations.", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (!error && data) {
            setMessages(data);
        }
    };

    const subscribeToMessages = (conversationId: string) => {
        const channel = supabase
            .channel(`public:messages:conversation_id=eq.${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const newMessage = payload.new as Message;
                const currentUser = userRef.current;
                const currentChat = selectedChatRef.current;

                console.log('📨 Realtime message received:', newMessage);

                // Update messages list
                setMessages(prev => {
                    // Check if this message already exists (from optimistic update)
                    const existingIndex = prev.findIndex(m => m.id === newMessage.id);
                    if (existingIndex !== -1) {
                        // Message already exists (sender's optimistic update), no need to add
                        console.log('✅ Message already exists (optimistic), skipping');
                        return prev;
                    }

                    // New message from other user - add it
                    console.log('✅ Adding new message to UI');
                    return [...prev, newMessage];
                });

                // If the message is from the other user and we're currently viewing this chat, mark as read immediately
                if (newMessage.conversation_id === currentChat?.id && newMessage.sender_id !== currentUser?.id) {
                    markAsRead(currentChat.id);
                }

                // Update last message in sidebar list locally
                setConversations(prev => prev.map(c => {
                    if (c.id === conversationId) {
                        const isCurrentChat = currentChat?.id === conversationId;
                        const isMyMessage = newMessage.sender_id === currentUser?.id;

                        // If I am viewing the chat, unread count is 0. 
                        // If NOT viewing, increment unread count (only for other user's messages).
                        const newUnreadCount = isCurrentChat ? 0 : (isMyMessage ? c.unread_count || 0 : (c.unread_count || 0) + 1);

                        return {
                            ...c,
                            last_message: newMessage.content,
                            last_message_at: newMessage.created_at,
                            unread_count: newUnreadCount
                        };
                    }
                    return c;
                }).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
            })
            .subscribe((status) => {
                console.log('🔌 Subscription status:', status);
            });

        return () => {
            console.log('🔌 Unsubscribing from channel');
            supabase.removeChannel(channel);
        };
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChat || !newMessage.trim() || !user) return;

        // Optimistic update
        const tempId = crypto.randomUUID();
        const msgContent = newMessage.trim();
        const optimisticMsg: Message = {
            id: tempId,
            conversation_id: selectedChat.id,
            sender_id: user.id,
            content: msgContent,
            created_at: new Date().toISOString(),
            is_read: false
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage(""); // Clear input immediately

        // Update sidebar preview immediately
        setConversations(prev => prev.map(c =>
            c.id === selectedChat.id
                ? { ...c, last_message: msgContent, last_message_at: optimisticMsg.created_at }
                : c
        ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));

        setSending(true);
        try {
            const { data, error } = await supabase
                .from("messages")
                .insert({
                    conversation_id: selectedChat.id,
                    sender_id: user.id,
                    content: msgContent
                })
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic message with real one
            if (data) {
                setMessages(prev => prev.map(m => m.id === tempId ? data : m));

                // Clean up notifications for this conversation (Action-Completed Cleanup)
                // If we reply to a chat, we don't need "New Message" notifications for it anymore
                await supabase
                    .from('notifications')
                    .delete()
                    .eq('recipient_user_id', user.id)
                    .eq('conversation_id', selectedChat.id)
                    .eq('type', 'chat_message');
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            console.error("Error details:", {
                message: error?.message,
                code: error?.code,
                details: error?.details,
                hint: error?.hint
            });

            // Rollback on error (optional, but good practice)
            setMessages(prev => prev.filter(m => m.id !== tempId));

            // Provide user-friendly error message
            const errorMessage = error?.message || "Failed to send message. Please try again.";
            showToast(errorMessage, "error");
        } finally {
            setSending(false);
        }
    };

    // Filter conversations
    const filteredConversations = conversations.filter(c =>
        c.other_user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Nav configurations
    const PROVIDER_NAV_ITEMS: NavItem[] = [
        { label: "My Offers", href: "/provider/offers", icon: LayoutGrid },
        { label: "Applications", href: "/provider/applications", icon: FileText },
        { label: "Chats", href: "/chats", icon: MessageSquare },
        { label: "Settings", href: "/provider/settings", icon: Settings },
    ];

    const CREATOR_NAV_ITEMS: NavItem[] = [
        { label: "Explore", href: "/creator/offers", icon: Compass },
        { label: "Applications", href: "/creator/applications", icon: ClipboardCheck },
        { label: "Chats", href: "/chats", icon: MessageSquare },
        { label: "Profile", href: "/creator/profile", icon: User },
    ];

    const currentNavItems = userType === 'provider' ? PROVIDER_NAV_ITEMS : CREATOR_NAV_ITEMS;

    return (
        <DashboardShell
            role={userType === 'provider' ? 'provider' : 'creator'}
            navItems={currentNavItems}
            profile={undefined}
            userId={user?.id}
        >
            <div className="h-[calc(100vh-200px)] bg-white rounded-[2rem] shadow-sm border border-gray-100 flex overflow-hidden">
                {/* Left Sidebar (Conversation List) */}
                <div className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    {/* Header */}
                    <div className="py-6 px-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
                            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <MessageSquare className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <p className="text-gray-400 text-sm">No conversations found.</p>
                                <p className="text-xs text-gray-300 mt-1">Chats start once an application is in progress.</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedChat(conv)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${selectedChat?.id === conv.id ? 'bg-gray-50 shadow-sm border border-gray-100/50' : 'hover:bg-gray-50 border border-transparent'}`}
                                >
                                    <div className="relative">
                                        <ProfileImage
                                            src={conv.other_user?.avatar_url}
                                            name={conv.other_user?.name}
                                            type={conv.other_user?.type || 'creator'}
                                            size="lg"
                                        />
                                        {/* Online indicator mock */}
                                        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className={`text-sm font-bold truncate ${selectedChat?.id === conv.id ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {conv.other_user?.name}
                                            </h3>
                                            {/* unread indicator */}
                                            {conv.unread_count > 0 && (
                                                <div className="w-2.5 h-2.5 bg-[#FF4D22] rounded-full shrink-0 mt-4 mr-2"></div>
                                            )}
                                        </div>
                                        <p className={`text-xs truncate ${selectedChat?.id === conv.id ? 'text-primary font-medium' : conv.unread_count > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                                            {conv.last_message}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Main Area (Chat Window) */}
                <div className={`flex-1 flex flex-col h-full bg-white relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="md:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                    <ProfileImage
                                        src={selectedChat.other_user?.avatar_url}
                                        name={selectedChat.other_user?.name}
                                        type={selectedChat.other_user?.type || 'creator'}
                                    />
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 leading-none">
                                            {selectedChat.other_user?.name}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-gray-50/30">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">👋</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold">Say Hello!</p>
                                            <p className="text-sm text-gray-500">Start the conversation with {selectedChat.other_user?.name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.sender_id === user?.id;
                                        const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id);

                                        const nextMsg = messages[idx + 1];
                                        const showTimestamp = !nextMsg || nextMsg.sender_id !== msg.sender_id || (new Date(nextMsg.created_at).getTime() - new Date(msg.created_at).getTime() > 5 * 60 * 1000);

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end flex flex-col' : 'items-start'}`}>
                                                    <div
                                                        className={`py-2 px-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                                                            ? 'bg-primary text-white rounded-br-none'
                                                            : 'bg-black text-white border border-gray-100 text-gray-700 rounded'
                                                            }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    {showTimestamp && (
                                                        <span className="text-[10px] text-gray-400 font-medium px-1">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Composer */}
                            <div className="p-4 md:p-4 bg-white border-t border-gray-100">
                                <form onSubmit={sendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
                                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-3xl px-6 pb-2 pt-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                        <textarea
                                            ref={textareaRef}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage(e as any);
                                                }
                                            }}
                                            placeholder="Type your message..."
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-m max-h-32 resize-none placeholder:text-gray-400 focus:outline-none"
                                            rows={1}
                                            style={{ minHeight: '24px', overflowY: 'auto' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                        className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                                    >
                                        {sending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5 ml-0.5 mr-1" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        /* Empty State (No chat selected) */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/50">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <MessageSquare className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Conversation</h3>
                            <p className="text-gray-500 text-center max-w-sm">
                                Choose a chat from the sidebar to start messaging with your partners.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}

export default function ChatsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
        }>
            <ChatsContent />
        </Suspense>
    );
}


