"use client";

import { Button } from "@/components/ui/button";
import { User, Mail, Plus } from "lucide-react";

export default function TeamPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Team Members</h1>
                    <p className="text-slate-400">Manage access to your global organization.</p>
                </div>
                <Button disabled className="bg-blue-600/50 cursor-not-allowed text-white gap-2">
                    <Plus className="w-4 h-4" /> Invite Member (Pro)
                </Button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950/30">
                    <div className="text-sm font-medium text-slate-400">Current Members</div>
                </div>
                <div className="divide-y divide-slate-800">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                ME
                            </div>
                            <div>
                                <div className="font-medium text-white">You</div>
                                <div className="text-xs text-slate-500">owner@example.com</div>
                            </div>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase">Owner</span>
                    </div>
                </div>
                <div className="p-8 text-center bg-slate-950/50">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
                        <User className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-medium mb-1">Collaborate with your team</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                        Upgrade to the Pro plan to invite other developers to your projects.
                    </p>
                    <Button variant="outline">View Plans</Button>
                </div>
            </div>
        </div>
    );
}
