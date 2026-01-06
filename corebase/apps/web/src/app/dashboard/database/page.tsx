"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Database, Table as TableIcon, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Table {
    id: string;
    table_name: string;
    schema_definition: any;
    created_at: string;
}

export default function DatabasePage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTables = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4000/tables", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTables(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleCreateTable = async () => {
        const tableName = prompt("Enter Table Name (e.g., users, posts):");
        if (!tableName) return;

        // Simplified schema for demo: title (text), status (text)
        // In a real app, we'd have a full schema builder UI
        const schema = {
            title: "text",
            status: "text",
            created_at: "date"
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4000/tables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ tableName, schema })
            });

            if (res.ok) {
                fetchTables();
            } else {
                alert("Failed to create table");
            }
        } catch (err) {
            alert("Error creating table");
        }
    };

    const handleDeleteTable = async (tableName: string) => {
        if (!confirm(`Are you sure you want to delete table '${tableName}'?`)) return;

        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/tables/${tableName}`, {
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
                    <p className="text-slate-400">Manage your dynamic schemas and data.</p>
                </div>
                <Button onClick={handleCreateTable} className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Plus className="w-4 h-4" /> Create Table
                </Button>
            </div>

            {loading ? (
                <div className="text-slate-500">Loading tables...</div>
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
                                    <h3 className="font-medium text-lg">{table.table_name}</h3>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span>Fields: {Object.keys(table.schema_definition || {}).join(", ")}</span>
                                        <span>•</span>
                                        <span>Created: {new Date(table.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/dashboard/database/${table.table_name}`}>
                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                                        View Data <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                                    onClick={() => handleDeleteTable(table.table_name)}
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
