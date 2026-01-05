"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Database, Table as TableIcon, Trash2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface Table {
    id: string;
    table_name: string;
    schema_definition: any; // backend uses 'schema', verifying mapping
    created_at: string;
}

export default function ProjectDatabasePage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTables = async () => {
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

        // Simplified schema for demo
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
        if (!confirm(`Are you sure you want to delete this table?`)) return;

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">Database</h1>
                    <p className="text-slate-400">Manage dynamic collections for Project: {projectId.slice(0, 8)}...</p>
                </div>
                <Button onClick={handleCreateTable} className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Plus className="w-4 h-4" /> Create Table
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : tables.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                    <Database className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tables found</h3>
                    <p className="text-slate-500 mb-6">Create a table to start storing data.</p>
                    <Button onClick={handleCreateTable} variant="outline">Create Table</Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tables.map((table) => (
                        <div key={table.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <TableIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-slate-200">{table.table_name}</h3>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span>ID: {table.id}</span>
                                        <span>•</span>
                                        <span>Created: {new Date(table.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* We'll create the record view page next, referencing table name or ID */}
                                <Link href={`/dashboard/projects/${projectId}/database/${table.table_name}`}>
                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                                        View Data <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                                    onClick={() => handleDeleteTable(table.id)} // Pass ID here, backend expects tableId
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
