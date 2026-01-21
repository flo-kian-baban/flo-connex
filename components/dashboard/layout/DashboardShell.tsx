"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Menu,
    X,
    LogOut,
    ChevronDown,
    Search,
    Bell,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import ProfileImage from "@/components/ui/ProfileImage";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import NotificationDropdown from "@/components/dashboard/notifications/NotificationDropdown";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

export interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

interface DashboardShellProps {
    children: React.ReactNode;
    role: "creator" | "provider";
    navItems: NavItem[];
    profile?: {
        name: string | null;
        image: string | null;
        email?: string | null;
    } | null;
    userId?: string;
}

export default function DashboardShell({
    children,
    role,
    navItems,
    profile,
    userId
}: DashboardShellProps) {
    const { profile: authProfile } = useAuth();
    const { showToast } = useToast();
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Use passed profile prop or fall back to context profile
    const displayProfile = profile || authProfile;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        showToast("Signed out successfully", "success");
        router.push(role === "provider" ? "/auth/provider/login" : "/auth/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Desktop */}
            <aside
                className={`
                    hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out
                    ${isCollapsed ? "w-[4.5rem]" : "w-24 lg:w-72"} 
                `}
            >
                {/* Sidebar Header */}
                <div className={`h-24 flex items-center px-3 mt-4 ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}>
                    <Link href={role === "provider" ? "/provider/offers" : "/creator/offers"} className="transition-transform hover:scale-105 active:scale-95">
                        <img
                            src={isCollapsed ? "/logos/Connex-Small.png" : "/logos/Connex-Big.png"}
                            alt="Connex"
                            className={isCollapsed ? "h-10 w-auto object-contain mt-2" : "h-16 w-auto ml-4 object-contain mt-2"}
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <div className="mt-0 flex-1 py-6 px-3 lg:px-4 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : undefined}
                                className={`
                                    flex items-center gap-4 transition-all duration-300 group relative overflow-hidden
                                    ${isCollapsed
                                        ? "w-10 h-10 rounded-full justify-center p-0 mx-auto"
                                        : "w-full justify-center lg:justify-start px-3 lg:px-4 py-3.5 rounded-2xl"
                                    }
                                    ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                                    }
                                `}
                            >
                                <Icon className={`w-[1.375rem] h-[1.375rem] shrink-0 transition-transform duration-300 ${isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-primary group-hover:scale-110"}`} />
                                <span className={`transition-opacity duration-300 ${isCollapsed ? "hidden" : "hidden lg:block"} ${isActive ? "" : "text-gray-600 group-hover:text-gray-900"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Sidebar Footer / Collapse Toggle */}
                <div className="p-4 border-t border-gray-50 flex flex-col gap-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`
                            flex items-center gap-3 transition-colors text-gray-400 hover:bg-gray-50 hover:text-gray-600
                            ${isCollapsed
                                ? "w-10 h-10 rounded-full justify-center p-0 mx-auto"
                                : "w-full justify-center lg:justify-start px-4 py-3 rounded-2xl"
                            }
                        `}
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                        <span className={`text-sm font-medium ${isCollapsed ? "hidden" : "hidden lg:block"}`}>Collapse sidebar</span>
                    </button>

                    {/* <div className={`
                        transition-all duration-300 ease-in-out
                        ${isCollapsed ? "hidden" : "hidden lg:block"}
                    `}>
                        <div className="px-4 py-3.5 rounded-3xl bg-gray-50/80 border border-gray-100 mt-2 flex items-center gap-3">
                            <ProfileImage
                                src={profile?.image}
                                name={profile?.name || profile?.email}
                                type={role}
                                size="sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{profile?.name || "User"}</p>
                                <p className="text-[10px] text-gray-500 truncate font-medium">{role === 'creator' ? 'Creator' : 'Partner'}</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl rounded-r-[2rem]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="h-24 flex items-center justify-between px-8 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <img src="/logos/Connex2.png" alt="Connex" className="h-9 w-auto" />
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 py-8 px-5 space-y-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200
                                    ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 font-medium"
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors font-medium border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "md:ml-[4.5rem]" : "md:ml-24 lg:md:ml-72"}`}>
                {/* Header */}
                <header className="sticky top-4 z-40  px-4 md:px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2.5 -ml-2 text-gray-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Page Titles could go here based on path if needed later */}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-4">
                        {/* Notifications */}
                        {userId && <NotificationDropdown userId={userId} />}

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-4 pr-5 pl-3 py-2 py-2 rounded-full bg-white border border-gray-100 hover:bg-gray-50 shadow-sm transition-all duration-200 group"
                            >
                                <ProfileImage
                                    src={displayProfile?.image}
                                    name={displayProfile?.name || displayProfile?.email}
                                    type={role}
                                    size="lg"
                                    className="mr-1 w-14 h-14 rounded-full"
                                />
                                <div className="hidden sm:block text-left mt-1 mr-12">
                                    <p className="text-m font-bold text-gray-900 leading-none group-hover:text-primary transition-colors">{displayProfile?.name || "User"}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{role === 'creator' ? 'Creator' : 'Business'}</p>
                                </div>
                                <ChevronDown className={`w-6 h-6 text-gray-400 mr-1 transition-transform duration-300 hidden sm:block ${isProfileMenuOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-400'}`} />
                            </button>

                            {isProfileMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-20" onClick={() => setIsProfileMenuOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-full bg-white rounded-[1.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-50 sm:hidden">
                                            <p className="text-sm font-bold text-gray-900">{displayProfile?.name || "User"}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{displayProfile?.email}</p>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium rounded-xl transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Scroll Area */}
                <main className="flex-1 overflow-x-hidden">
                    <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
