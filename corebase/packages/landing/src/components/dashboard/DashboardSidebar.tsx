"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Database, Key, Settings, Fingerprint, Folder, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
    const pathname = usePathname();

    // Extract project ID if we are in a project route
    // /dashboard/projects/[id]/...
    const match = pathname.match(/\/dashboard\/projects\/([^\/]+)/);
    const projectId = match ? match[1] : null;

    const globalNav = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", href: "/dashboard/projects", icon: Folder },
    ];

    const projectNav = projectId ? [
        { name: "Overview", href: `/dashboard/projects/${projectId}`, icon: LayoutDashboard },
        { name: "Database", href: `/dashboard/projects/${projectId}/database`, icon: Database },
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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col z-50">
            <div className="p-6 border-b border-slate-800">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <Database className="w-4 h-4" />
                    </div>
                    CoreBase
                </Link>
                {projectId && (
                    <div className="mt-4 px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-mono rounded border border-blue-500/20 truncate">
                        Project: {projectId.slice(0, 8)}...
                    </div>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                    {projectId ? 'Project Menu' : 'Global Menu'}
                </div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-blue-600/10 text-blue-400"
                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Always show Docs/Global Settings if not in project */}
                {!projectId && (
                    <>
                        <div className="my-2 border-t border-slate-800" />
                        <Link href="/docs" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800">
                            <BookOpen className="w-5 h-5" /> Documentation
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800">
                            <Settings className="w-5 h-5" /> Global Settings
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                {projectId && (
                    <Link href="/dashboard/projects" className="block mb-2">
                        <Button variant="outline" className="w-full justify-start text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white">
                            ← Switch Project
                        </Button>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10 gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
