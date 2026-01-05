"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Key, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardOverviewPage() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalRequests: "1.2M", // Mock
        activeKeys: 0,
        status: "Healthy"
    });

    useEffect(() => {
        // Fetch real stats where possible
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                // Fetch projects count
                const res = await fetch("http://localhost:4000/projects", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(prev => ({ ...prev, totalProjects: data.data?.length || 0 }));
                }

                // Fetch keys count 
                const kRes = await fetch("http://localhost:4000/api-keys", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (kRes.ok) {
                    const kData = await kRes.json();
                    setStats(prev => ({ ...prev, activeKeys: kData.data?.length || 0 }));
                }

            } catch (e) { console.error(e); }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Command Center</h1>
                    <p className="text-slate-400 mt-1">Global overview of your CoreBase infrastructure.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/docs">
                        <Button variant="outline" className="border-slate-700 text-slate-300">Read the Docs</Button>
                    </Link>
                    <Link href="/dashboard/projects">
                        <Button className="bg-blue-600 hover:bg-blue-500">Manage Projects</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Projects</CardTitle>
                        <Layers className="w-4 h-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
                        <p className="text-xs text-slate-500 mt-1">Active instances</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">API Requests</CardTitle>
                        <Activity className="w-4 h-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalRequests}</div>
                        <p className="text-xs text-slate-500 mt-1">Past 30 days (Global)</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Active Keys</CardTitle>
                        <Key className="w-4 h-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.activeKeys}</div>
                        <p className="text-xs text-slate-500 mt-1">Across all projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">System Status</CardTitle>
                        <Database className="w-4 h-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.status}</div>
                        <p className="text-xs text-slate-500 mt-1">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 text-sm border-b border-white/5 pb-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <div className="flex-1">
                                        <div className="text-slate-300">Deployment successful</div>
                                        <div className="text-slate-500 text-xs">Project Alpha • 2 mins ago</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
                    <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full text-primary ring-1 ring-primary/20">
                            <Layers className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Jump back in</h3>
                        <p className="text-slate-400 max-w-xs">
                            Continue building your next big idea. Manage your databases and APIs with ease.
                        </p>
                        <Link href="/dashboard/projects">
                            <Button className="w-full bg-white text-black hover:bg-slate-200">
                                Go to Projects <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
