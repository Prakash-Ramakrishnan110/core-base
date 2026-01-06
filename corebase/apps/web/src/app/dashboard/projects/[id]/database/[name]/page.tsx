"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Trash2, Loader2, Search, Download, Filter, MoreHorizontal, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectTableRecordsPage() {
    const params = useParams();
    const projectId = params.id as string;
    const tableName = params.name as string;
    const router = useRouter();

    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/tables/${tableName}/records`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRecords(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId && tableName) fetchRecords();
    }, [projectId, tableName]);

    const handleAddRecord = async () => {
        const title = prompt("Enter Title (for demo):");
        if (!title) return;

        const record = {
            title,
            status: "active",
            created_at: new Date().toISOString()
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/tables/${tableName}/records`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(record)
            });

            if (res.ok) {
                fetchRecords();
            } else {
                alert("Failed to add record.");
            }
        } catch (err) {
            alert("Error adding record");
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (!confirm("Delete this record?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/projects/${projectId}/tables/${tableName}/records/${recordId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchRecords();
        } catch (err) {
            alert("Error deleting record");
        }
    }

    // Filter records locally for demo
    const filteredRecords = records.filter(r =>
        JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/projects/${projectId}/database`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Database</span>
                            <span>/</span>
                            <span>Tables</span>
                            <span>/</span>
                        </div>
                        <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                            <span className="text-blue-400">public</span>.{tableName}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-9 bg-slate-900 border-slate-700 text-slate-300">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                    <Button onClick={handleAddRecord} className="h-9 bg-blue-600 hover:bg-blue-500">
                        <Plus className="w-4 h-4 mr-2" /> Insert Row
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <Search className="w-4 h-4 text-slate-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-sm text-white focus:ring-0 flex-1 placeholder:text-slate-600"
                />
                <div className="w-px h-4 bg-slate-700" />
                <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-white">
                    <Filter className="w-3 h-3 mr-1" /> Filter
                </Button>
                <div className="w-px h-4 bg-slate-700" />
                <span className="text-xs text-slate-500 px-2">
                    {filteredRecords.length} records
                </span>
            </div>

            {/* Data Grid */}
            <div className="flex-1 border border-slate-800 rounded-lg bg-slate-900 overflow-hidden relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : null}

                {!loading && records.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">This table is empty</p>
                        <p className="text-sm mt-1">Insert a row to see data here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto h-full">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-[#0F172A] sticky top-0 z-10">
                                <tr>
                                    <th className="w-12 px-4 py-3 border-b border-r border-slate-800 bg-[#0F172A]">
                                        <input type="checkbox" className="rounded border-slate-700 bg-slate-800" />
                                    </th>
                                    <th className="px-4 py-3 border-b border-r border-slate-800 font-medium text-slate-400 whitespace-nowrap min-w-[100px]">ID</th>
                                    {records[0] && Object.keys(records[0]).filter(k => k !== 'id').map(key => (
                                        <th key={key} className="px-4 py-3 border-b border-r border-slate-800 font-medium text-slate-400 whitespace-nowrap min-w-[150px]">
                                            {key}
                                        </th>
                                    ))}
                                    <th className="w-10 px-2 border-b border-slate-800"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-4 py-2 border-r border-slate-800">
                                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800" />
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-500 border-r border-slate-800 bg-slate-900/30">
                                            {record.id.slice(0, 8)}...
                                        </td>
                                        {Object.keys(record).filter(k => k !== 'id').map(key => (
                                            <td key={`${record.id}-${key}`} className="px-4 py-2 text-slate-300 border-r border-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">
                                                {typeof record[key] === 'object' ? JSON.stringify(record[key]) : String(record[key])}
                                            </td>
                                        ))}
                                        <td className="px-2 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteRecord(record.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
