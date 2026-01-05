"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Database, Table as TableIcon, Trash2, ArrowRight, Loader2, MoreVertical, Search, Filter, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Table {
    id: string;
    table_name: string;
    schema_definition: any;
    created_at: string;
    row_count?: number; // Optional metadata
}

export default function ProjectDatabasePage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTables = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/tables`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setTables(data.tables || []);
            } else if (res.status === 401) {
                router.push("/auth/login");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchTables();
    }, [projectId]);

    const handleCreateTable = async () => {
        const tableName = prompt("Enter Table Name (alphanumeric, e.g., 'users'):");
        if (!tableName) return;

        const body = {
            tableName,
            columns: [
                { name: "title", type: "text" },
                { name: "status", type: "text" },
                { name: "created_at", type: "timestamp" }
            ]
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/tables`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchTables();
            } else {
                const err = await res.json();
                alert(`Failed to create table: ${err.error || 'Unknown error'}`);
            }
        } catch (err) {
            alert("Error creating table");
        }
    };

    const handleDeleteTable = async (tableId: string) => {
        if (!confirm(`Are you sure you want to delete this table? This action cannot be undone.`)) return;

        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/projects/${projectId}/tables/${tableId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchTables();
        } catch (err) {
            alert("Error deleting table");
        }
    };

    const filteredTables = tables.filter(t => t.table_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Database</h1>
                    <p className="text-slate-400">Manage your data schemas and tables.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchTables} className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </Button>
                    <Button onClick={handleCreateTable} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4 mr-2" /> New Table
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search tables..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:ring-0 px-10 py-2"
                    />
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
            </div>

            {/* Content */}
            {loading && tables.length === 0 ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            ) : filteredTables.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-center"
                >
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                        <Database className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        {searchQuery ? "No tables match your search" : "No tables created yet"}
                    </h3>
                    <p className="text-slate-500 mb-8 max-w-sm">
                        {searchQuery ? "Try verifying your search query." : "Create your first table to start defining your data schema."}
                    </p>
                    <Button onClick={handleCreateTable} variant={searchQuery ? "outline" : "default"}>
                        {searchQuery ? "Clear Search" : "Create Table"}
                    </Button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTables.map((table, i) => (
                            <motion.div
                                key={table.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors shadow-lg hover:shadow-blue-900/20"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <TableIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-100">{table.table_name}</h3>
                                            <div className="text-xs text-slate-500 font-mono">ID: {table.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={() => handleDeleteTable(table.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Rows</span>
                                        <span className="text-slate-300 font-mono">0</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Privacy</span>
                                        <span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">Public</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Created</span>
                                        <span className="text-slate-300">{new Date(table.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Link href={`/dashboard/projects/${projectId}/database/${table.table_name}`}>
                                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
                                        View Data <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
