"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardNavbar() {
    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            {/* Search (Placeholder for Cmd+K) */}
            <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search projects, docs, or settings (Cmd+K)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400 transition-all focus:bg-white"
                />
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </Button>

                <div className="w-px h-8 bg-slate-200 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-slate-900">Demo User</div>
                        <div className="text-xs text-slate-500">Free Tier</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border border-slate-200 shadow-sm flex items-center justify-center text-white font-bold text-sm">
                        DU
                    </div>
                </div>
            </div>
        </header>
    );
}
