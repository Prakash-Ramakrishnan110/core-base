"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectSettingsPage() {
    const { id } = useParams();
    const router = useRouter();
    const projectId = id as string;

    const handleDeleteProject = async () => {
        const confirmName = prompt("To confirm, type 'DELETE':");
        if (confirmName !== "DELETE") return;

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
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="border-b border-white/5 pb-6">
                <h1 className="text-3xl font-bold">Project Settings</h1>
                <p className="text-slate-400">Manage settings for project ID: {projectId}</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Project Name</label>
                        <Input disabled value="Project Alpha (Coming Soon: Rename)" className="bg-slate-950 border-slate-700 text-slate-400" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-red-500/5 border-red-500/20">
                <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription className="text-red-500/70">Permanently delete this project and all its data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleDeleteProject} className="gap-2">
                        <Trash2 className="w-4 h-4" /> Delete Project
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
