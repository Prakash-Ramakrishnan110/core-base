"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ShieldAlert, CheckCircle, XCircle } from "lucide-react";

interface AuditLog {
    id: string;
    action: string;
    resource: string;
    status: "success" | "failure";
    created_at: string;
    ip_address: string;
}

export default function AuditLogsPage() {
    const { id } = useParams();
    const projectId = id as string;
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking fetching logs for now as backend module might need setup
        // Real endpoint would be GET /projects/:id/audit
        setTimeout(() => {
            setLogs([
                { id: "1", action: "API_KEY_CREATED", resource: "Production Key", status: "success", created_at: new Date().toISOString(), ip_address: "192.168.1.1" },
                { id: "2", action: "TABLE_CREATED", resource: "users_table", status: "success", created_at: new Date(Date.now() - 3600000).toISOString(), ip_address: "192.168.1.1" },
                { id: "3", action: "DELETE_RECORD", resource: "posts/123", status: "failure", created_at: new Date(Date.now() - 7200000).toISOString(), ip_address: "10.0.0.5" },
            ]);
            setLoading(false);
        }, 800);
    }, [projectId]);

    return (
        <div className="space-y-6">
            <div className="border-b border-white/5 pb-6">
                <h1 className="text-3xl font-bold">Audit Logs</h1>
                <p className="text-slate-400">Security and activity tracking for Project: {projectId}</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-medium">
                            <tr>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Resource</th>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3">
                                        {log.status === "success" ? (
                                            <span className="flex items-center gap-2 text-green-400">
                                                <CheckCircle className="w-4 h-4" /> Success
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-red-400">
                                                <XCircle className="w-4 h-4" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-200">{log.action}</td>
                                    <td className="px-4 py-3 text-slate-400 font-mono">{log.resource}</td>
                                    <td className="px-4 py-3 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-500 font-mono">{log.ip_address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
