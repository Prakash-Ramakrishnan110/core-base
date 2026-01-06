"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ShieldAlert, CheckCircle, XCircle, Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLog {
    id: string;
    action: string;
    resource: string;
    status: "success" | "failure";
    created_at: string;
    ip_address: string;
    details?: string;
}

export default function AuditLogsPage() {
    const { id } = useParams();
    const projectId = id as string;
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        // Mocking data for premium reveal
        setTimeout(() => {
            setLogs([
                { id: "1", action: "API_KEY_CREATED", resource: "Production Web App", status: "success", created_at: new Date().toISOString(), ip_address: "192.168.1.104", details: "Created by admin" },
                { id: "2", action: "TABLE_SCHEMA_UPDATE", resource: "users", status: "success", created_at: new Date(Date.now() - 3600000).toISOString(), ip_address: "192.168.1.104", details: "Added column 'phone_number'" },
                { id: "3", action: "RECORD_DELETE", resource: "products/8821", status: "failure", created_at: new Date(Date.now() - 7200000).toISOString(), ip_address: "10.0.0.5", details: "Permission denied" },
                { id: "4", action: "PROJECT_SETTINGS_UPDATE", resource: "General", status: "success", created_at: new Date(Date.now() - 86400000).toISOString(), ip_address: "192.168.1.104", details: "Changed project name" },
                { id: "5", action: "AUTH_LOGIN", resource: "Dashboard", status: "success", created_at: new Date(Date.now() - 90000000).toISOString(), ip_address: "192.168.1.104", details: "Session started" },
            ]);
            setLoading(false);
        }, 800);
    }, [projectId]);

    const filteredLogs = logs.filter(l =>
        l.action.toLowerCase().includes(filter.toLowerCase()) ||
        l.resource.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Audit Logs</h1>
                    <p className="text-slate-400">Track every action taken within this project.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white">
                        <Calendar className="w-4 h-4 mr-2" /> Date Range
                    </Button>
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white">
                        <DownloadIcon className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <Search className="w-4 h-4 text-slate-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search logs by action or resource..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-transparent border-none text-sm text-white focus:ring-0 flex-1 placeholder:text-slate-600 outline-none"
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Resource</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">IP Address</th>
                                    <th className="px-6 py-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No logs found matching your criteria.</td>
                                    </tr>
                                ) : filteredLogs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4">
                                            {log.status === "success" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <CheckCircle className="w-3 h-3" /> Success
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <XCircle className="w-3 h-3" /> Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 font-medium">{log.resource}</td>
                                        <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={log.details}>{log.details}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.ip_address}</td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function DownloadIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    )
}
