"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Save, AlertTriangle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ProjectSettingsPage() {
    const { id } = useParams();
    const router = useRouter();
    const projectId = id as string;

    // State
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`http://localhost:4000/projects/${projectId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: project.name })
            });
            if (res.ok) {
                // Success feedback?
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    }

    const handleDeleteProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (deleteConfirmation !== "DELETE") return;

        setDeleteLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                router.push("/dashboard/projects");
            } else {
                alert("Failed to delete project");
            }
        } catch (err) {
            alert("Error deleting project");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
    if (!project) return <div className="p-12 text-center text-slate-500">Project not found.</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <div className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Project Settings</h1>
                <p className="text-slate-500">Manage configuration and dangerous actions.</p>
            </div>

            {/* General Settings */}
            <div className="grid gap-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">General Configuration</h3>
                    <p className="text-sm text-slate-500">Update your project's identity and basic settings.</p>
                </div>

                <div className="grid gap-4 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Project Name</label>
                        <Input
                            value={project.name}
                            onChange={(e) => setProject({ ...project, name: e.target.value })}
                            className="bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-4">
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="grid gap-6 bg-red-50 border border-red-200 rounded-xl p-6">
                <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-sm text-red-600/70">Irreversible actions. Please be careful.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg shadow-sm">
                    <div>
                        <div className="font-medium text-red-900">Delete Project</div>
                        <div className="text-sm text-red-600/70">Permanently remove this project and all its data.</div>
                    </div>
                    <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700 text-white border-none shadow-sm shadow-red-500/20">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="bg-white border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Delete Project?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-slate-600 text-sm">
                            This action cannot be undone. This will permanently delete the project <span className="font-bold text-slate-900">{project.name}</span> and all associated data (database, functions, storage).
                        </p>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-slate-500">Type "DELETE" to confirm</label>
                            <Input
                                value={deleteConfirmation}
                                onChange={e => setDeleteConfirmation(e.target.value)}
                                className="bg-red-50 border-red-200 text-red-900 placeholder:text-red-300 focus:ring-red-500"
                                placeholder="DELETE"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteProject}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                            disabled={deleteConfirmation !== "DELETE" || deleteLoading}
                        >
                            {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
