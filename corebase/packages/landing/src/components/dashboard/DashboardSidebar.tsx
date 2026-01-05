"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Database, Key, Settings, Fingerprint, Folder, BookOpen, LogOut, ChevronLeft, ChevronRight, Zap, Layers, User, CreditCard, Bell, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Auto-collapse on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setCollapsed(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Extract project ID if we are in a project route
    const match = pathname.match(/\/dashboard\/projects\/([^\/]+)/);
    const projectId = match ? match[1] : null;

    const globalNav = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", href: "/dashboard/projects", icon: Folder },
        { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
        { name: "Team", href: "/dashboard/team", icon: User },
    ];

    const projectNav = projectId ? [
        { name: "Overview", href: `/dashboard/projects/${projectId}`, icon: LayoutDashboard },
        { name: "Database", href: `/dashboard/projects/${projectId}/database`, icon: Database },
        { name: "Auth & Users", href: `/dashboard/projects/${projectId}/auth`, icon: User },
        { name: "Storage", href: `/dashboard/projects/${projectId}/storage`, icon: HardDrive },
        { name: "Functions", href: `/dashboard/projects/${projectId}/functions`, icon: Zap },
        { name: "API Keys", href: `/dashboard/projects/${projectId}/keys`, icon: Key },
        { name: "Audit Logs", href: `/dashboard/projects/${projectId}/logs`, icon: Fingerprint },
        { name: "Settings", href: `/dashboard/projects/${projectId}/settings`, icon: Settings },
    ] : [];

    const navItems = projectId ? projectNav : globalNav;

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 280 }}
            className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300"
        >
            {/* Logo Area */}
            <div className="h-40 flex items-center justify-center border-b border-slate-200 relative p-4">
                <Link href="/dashboard" className="flex items-center justify-center w-full h-full">
                    <img src="/logo.png" alt="CoreBase Logo" className="w-auto h-32 object-contain" />
                </Link>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </div>

            {/* Project Context (if selected) */}
            <AnimatePresence>
                {!collapsed && projectId && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 py-4 border-b border-slate-200"
                    >
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-500 mb-1">Current Project</div>
                            <div className="font-medium text-sm text-slate-900 truncate">{projectId.slice(0, 12)}...</div>
                            <Link href="/dashboard/projects" className="text-xs text-blue-600 hover:text-blue-500 mt-2 block">
                                ← Switch Project
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {!collapsed && (
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                        {projectId ? 'Project Menu' : 'Main Menu'}
                    </div>
                )}

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900")} />
                            <motion.span
                                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                {item.name}
                            </motion.span>
                        </Link>
                    );
                })}

                <div className="my-4 border-t border-slate-200" />

                <Link href="/docs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 group">
                    <BookOpen className="w-5 h-5 flex-shrink-0 group-hover:text-purple-600 transition-colors" />
                    <motion.span animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }} className="overflow-hidden whitespace-nowrap">Documentation</motion.span>
                </Link>

                <div className="mt-auto" />
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-200">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3",
                        collapsed && "justify-center px-0"
                    )}
                    onClick={handleLogout}
                >

                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && "Sign Out"}
                </Button>
            </div>
        </motion.aside>
    );
}
