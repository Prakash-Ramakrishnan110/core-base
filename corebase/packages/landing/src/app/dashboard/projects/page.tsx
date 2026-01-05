"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Folder, ArrowRight, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            setProjects(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        const name = prompt("Project Name (e.g. Mobile App Backend):");
        if (!name) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4000/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, description: "Created via Dashboard" })
            });

            if (res.ok) fetchProjects();
        } catch (err) {
            alert("Create failed");
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation
        if (!confirm("Are you sure? This deletes ALL data.")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/projects/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchProjects();
        } catch (err) {
            alert("Delete failed");
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">Your Projects</h1>
                    <p className="text-slate-400">Select a project to manage its database and keys.</p>
                </div>
                <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Plus className="w-4 h-4" /> New Project
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
                    <Folder className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-200 mb-2">No projects yet</h3>
                    <p className="text-slate-500 mb-6">Create your first project to get started.</p>
                    <Button onClick={handleCreateProject} variant="outline">Create Project</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group relative block h-full">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition duration-300 blur-sm" />
                            <Card className="h-full bg-slate-950/80 border-slate-800 hover:border-slate-700 transition-colors">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-500 hover:text-red-400 -mr-2 -mt-2"
                                            onClick={(e) => handleDeleteProject(e, project.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-100 mb-2 truncate">{project.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500 font-mono">
                                        <span>ID: {project.id.slice(0, 8)}...</span>
                                        <div className="flex items-center gap-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
