"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TableRecordsPage() {
    const { name: tableName } = useParams();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/tables/${tableName}/records`, {
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
        if (tableName) fetchRecords();
    }, [tableName]);

    const handleAddRecord = async () => {
        // For demo: minimal record
        const title = prompt("Enter Title:");
        if (!title) return;

        const record = {
            title,
            status: "draft",
            created_at: new Date().toISOString() // Should actually match schema types
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/tables/${tableName}/records`, {
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
                alert("Failed to add record. Ensure fields match schema.");
            }
        } catch (err) {
            alert("Error adding record");
        }
    };

    const handleDeleteRecord = async (id: string) => {
        if (!confirm("Delete this record?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/tables/${tableName}/records/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchRecords();
        } catch (err) {
            alert("Error deleting record");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/database">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-mono text-blue-400">{tableName}</h1>
                        <p className="text-slate-400 text-sm">Viewing all records.</p>
                    </div>
                </div>
                <Button onClick={handleAddRecord} className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Plus className="w-4 h-4" /> Add Document
                </Button>
            </div>

            {loading ? (
                <div className="text-slate-500">Loading records...</div>
            ) : records.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    No records found in this table.
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-medium">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                {records[0] && Object.keys(records[0]).filter(k => k !== 'id').map(key => (
                                    <th key={key} className="px-4 py-3">{key}</th>
                                ))}
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{record.id}</td>
                                    {Object.keys(record).filter(k => k !== 'id').map(key => (
                                        <td key={`${record.id}-${key}`} className="px-4 py-3 text-slate-300">
                                            {typeof record[key] === 'object' ? JSON.stringify(record[key]) : String(record[key])}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-red-400"
                                            onClick={() => handleDeleteRecord(record.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
