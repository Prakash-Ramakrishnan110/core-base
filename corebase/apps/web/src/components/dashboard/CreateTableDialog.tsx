"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash2, Loader2, Save } from "lucide-react";

interface Column {
    name: string;
    type: "text" | "number" | "boolean" | "timestamp";
    required: boolean;
    unique: boolean;
}

interface CreateTableDialogProps {
    projectId: string;
    onSuccess: () => void;
    children?: React.ReactNode;
}

export function CreateTableDialog({ projectId, onSuccess, children }: CreateTableDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableName, setTableName] = useState("");
    const [columns, setColumns] = useState<Column[]>([
        { name: "id", type: "text", required: true, unique: true }, // Default ID
        { name: "created_at", type: "timestamp", required: true, unique: false }
    ]);
    const [userColumns, setUserColumns] = useState<Column[]>([]);

    const addColumn = () => {
        setUserColumns([...userColumns, { name: "", type: "text", required: false, unique: false }]);
    };

    const removeColumn = (index: number) => {
        const newCols = [...userColumns];
        newCols.splice(index, 1);
        setUserColumns(newCols);
    };

    const updateColumn = (index: number, field: keyof Column, value: any) => {
        const newCols = [...userColumns];
        newCols[index] = { ...newCols[index], [field]: value };
        setUserColumns(newCols);
    };

    const handleSubmit = async () => {
        if (!tableName.trim()) return alert("Table name is required");
        if (userColumns.some(c => !c.name.trim())) return alert("All column names are required");

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/tables`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    tableName,
                    columns: userColumns
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create table");
            }

            setOpen(false);
            setTableName("");
            setUserColumns([]);
            onSuccess();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Area */}
            <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                {children || (
                    <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4 mr-2" /> New Table
                    </Button>
                )}
            </div>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create New Table</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Table Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Table Name</label>
                            <input
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                placeholder="e.g. posts, products"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-500">Lowercase alphanumeric and underscores only.</p>
                        </div>

                        {/* Columns */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-400">Columns</label>
                                <Button size="sm" variant="ghost" onClick={addColumn} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                    <Plus className="w-4 h-4 mr-1" /> Add Column
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {/* System Columns (Visual only) */}
                                <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 opacity-50 cursor-not-allowed">
                                    <input disabled value="id" className="flex-1 bg-transparent border-none text-sm" />
                                    <span className="text-xs px-2 py-1 bg-slate-800 rounded">uuid</span>
                                    <div className="w-8" />
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 opacity-50 cursor-not-allowed">
                                    <input disabled value="created_at" className="flex-1 bg-transparent border-none text-sm" />
                                    <span className="text-xs px-2 py-1 bg-slate-800 rounded">timestamp</span>
                                    <div className="w-8" />
                                </div>

                                {/* User Columns */}
                                {userColumns.map((col, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-1">
                                        <input
                                            value={col.name}
                                            onChange={(e) => updateColumn(i, 'name', e.target.value)}
                                            placeholder="Column name"
                                            className="flex-1 bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-sm px-2 py-1 transition-colors"
                                            autoFocus
                                        />
                                        <select
                                            value={col.type}
                                            onChange={(e) => updateColumn(i, 'type', e.target.value)}
                                            className="bg-slate-800 border border-slate-700 rounded text-xs px-2 py-1.5 outline-none focus:border-blue-500"
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="timestamp">Timestamp</option>
                                        </select>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => removeColumn(i)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-500">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Create Table
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
