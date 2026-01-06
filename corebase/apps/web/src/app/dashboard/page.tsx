"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Database, Key, Layers, ArrowRight, Plus, Users, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MiniChart } from "@/components/ui/chart";

export default function DashboardOverviewPage() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalRequests: "1.2M",
        activeKeys: 0,
        status: "Healthy"
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch real stats where possible
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:4000/projects", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                // Mocking data for visual polish if fetch fails or for demo
                const data = res.ok ? await res.json() : { data: [] };

                setStats({
                    totalProjects: data.data?.length || 3,
                    totalRequests: "842.3k", // Demo number
                    activeKeys: 12, // Demo number
                    status: "99.99%"
                });
                setLoading(false);

            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            sub: "Active instances",
            icon: Layers,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            chartData: [10, 25, 15, 30, 45, 35, 50],
            chartColor: "#60a5fa"
        },
        {
            title: "API Requests",
            value: stats.totalRequests,
            sub: "Past 30 days",
            icon: Activity,
            color: "text-green-400",
            bg: "bg-green-500/10",
            chartData: [40, 35, 55, 45, 70, 65, 85],
            chartColor: "#4ade80"
        },
        {
            title: "Active Keys",
            value: stats.activeKeys,
            sub: "Across all projects",
            icon: Key,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            chartData: [12, 12, 13, 13, 14, 12, 12],
            chartColor: "#facc15"
        },
        {
            title: "Uptime",
            value: stats.status,
            sub: "Global Availability",
            icon: Zap,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            chartData: [100, 100, 99, 100, 100, 100, 100],
            chartColor: "#c084fc"
        }
    ];

    const recentActivity = [
        { action: "Project Created", target: "E-commerce Backend", user: "You", time: "2 hours ago" },
        { action: "API Key Generated", target: "Prod Key - Read Only", user: "You", time: "5 hours ago" },
        { action: "Database Schema Updated", target: "Users Table", user: "Team Member", time: "1 day ago" },
    ];

    return (

        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back to your command center.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/projects">
                        <Button className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/20 text-white">
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group relative overflow-hidden shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-slate-500 text-sm font-medium mb-1">{card.title}</h3>
                                <div className="text-2xl font-bold text-slate-900">{loading ? "-" : card.value}</div>
                            </div>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                        </div>

                        <MiniChart data={card.chartData} color={card.chartColor} height={40} className="opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                            <Clock className="w-3 h-3" />
                            {card.sub}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All</Button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                            {activity.action}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {activity.target} • <span className="text-slate-400">{activity.user}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                    {activity.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Access */}
                    <h2 className="text-xl font-bold text-slate-900 pt-4">Quick Access</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/docs/guide/start" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <Database className="w-5 h-5 text-blue-500" />
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="font-semibold text-slate-900">Database Guide</div>
                            <div className="text-xs text-slate-500 mt-1">Learn how to create dynamic schemas</div>
                        </Link>

                        <Link href="/docs/api/keys" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-500/50 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <Key className="w-5 h-5 text-purple-500" />
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="font-semibold text-slate-900">API Security</div>
                            <div className="text-xs text-slate-500 mt-1">Best practices for API keys</div>
                        </Link>
                    </div>
                </div>

                {/* Team / System Status */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">System Status</h2>
                    <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-slate-700">All Systems Operational</span>
                            </div>
                            <span className="text-xs text-green-600 font-mono">v1.0.2</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">API Latency</span>
                                <span className="text-green-600">24ms</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-green-500 w-[20%] h-full rounded-full" />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Database Load</span>
                                <span className="text-blue-600">12%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-blue-500 w-[12%] h-full rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-lg shadow-blue-900/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <h3 className="font-bold text-lg mb-2 relative z-10">Upgrade to Pro</h3>
                        <p className="text-blue-100 text-sm mb-4 relative z-10">Get unlimited projects, advanced audit logs, and priority support.</p>

                        <Button variant="secondary" size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50 relative z-10 font-semibold border-0">
                            Upgrade Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
