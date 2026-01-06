"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Save, Lock, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Need switch component or just checkbox

interface CreateBucketDialogProps {
    projectId: string;
    onSuccess: () => void;
    children?: React.ReactNode;
}

export function CreateBucketDialog({ projectId, onSuccess, children }: CreateBucketDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return alert("Bucket name is required");
        const id = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/storage/buckets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id, name, public: isPublic })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create bucket");
            }

            setOpen(false);
            setName("");
            setIsPublic(false);
            onSuccess();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                {children || (
                    <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4 mr-2" /> New Bucket
                    </Button>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create Storage Bucket</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Bucket Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. avatars, documents"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-500">ID will be: {name ? name.toLowerCase().replace(/[^a-z0-9-_]/g, '-') : '...'}</p>
                        </div>

                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                {isPublic ? <Globe className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
                                <div>
                                    <div className="text-sm font-medium text-slate-200">Public Bucket</div>
                                    <div className="text-xs text-slate-500">Anyone can read objects without auth.</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="w-5 h-5 accent-blue-600"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-500">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Create Bucket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
