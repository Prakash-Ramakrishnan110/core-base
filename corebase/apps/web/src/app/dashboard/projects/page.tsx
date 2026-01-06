"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Folder, ArrowRight, Loader2, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Project {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export default function ProjectsListPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            const res = await fetch("http://localhost:4000/projects", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                if (res.status === 401) router.push("/auth/login");
                return;
            }

            const data = await res.json();
            setProjects(data.projects || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;
        setCreateLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4000/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                setIsCreateOpen(false);
                setFormData({ name: "", description: "" });
                // Redirect to the new project dashboard immediately
                router.push(`/dashboard/projects/${data.id}`);
            } else {
                const errData = await res.json();
                alert(`Failed to create project: ${errData.message || res.statusText}`);
            }
        } catch (err: any) {
            alert(`Network error: ${err.message}`);
        } finally {
            setCreateLoading(false);
        }
    };

    const confirmDelete = (e: React.MouseEvent, project: Project) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete(project);
        setDeleteConfirmation("");
        setIsDeleteOpen(true);
    };

    const handleDeleteProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectToDelete || deleteConfirmation !== "DELETE") return;

        setDeleteLoading(true);
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/projects/${projectToDelete.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setIsDeleteOpen(false);
            fetchProjects();
        } catch (err) {
            alert("Delete failed");
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
                    <p className="text-slate-500">Select a project to manage its database and keys.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 gap-2 text-white shadow-md shadow-blue-600/20">
                    <Plus className="w-4 h-4" /> New Project
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                    <Folder className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-900 mb-2">No projects yet</h3>
                    <p className="text-slate-500 mb-6">Create your first project to get started.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100">Create Project</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group relative block h-full">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition duration-300 blur-sm" />
                            <Card className="h-full bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all shadow-sm">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2 z-10 relative"
                                            onClick={(e) => confirmDelete(e, project)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{project.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                                        <span>ID: {project.id.substring(0, 8)}...</span>
                                        <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">Create New Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Project Name</label>
                            <Input
                                autoFocus
                                type="text"
                                placeholder="e.g. My Awesome App"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
                            <textarea
                                placeholder="What is this project about?"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 resize-none"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">Cancel</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={createLoading}>
                                {createLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Create Project
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="bg-white border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Delete Project?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-slate-600 text-sm">
                            This action cannot be undone. This will permanently delete <span className="font-bold text-slate-900">{projectToDelete?.name}</span>?
                        </p>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-slate-500">Type "DELETE" to confirm</label>
                            <Input
                                value={deleteConfirmation}
                                onChange={e => setDeleteConfirmation(e.target.value)}
                                className="bg-red-50 border-red-200 text-red-900 placeholder:text-red-400 focus:ring-red-500 border-red-200"
                                placeholder="DELETE"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="text-slate-600">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteProject}
                            className="bg-red-600 hover:bg-red-700"
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
