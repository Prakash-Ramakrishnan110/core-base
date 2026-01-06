"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Database, Key, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProjectOverviewPage() {
    const params = useParams();
    const projectId = params.id as string;
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProject(data.data);
            }
        };
        fetchProject();
    }, [projectId]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">{project ? project.name : "Loading..."}</h1>
                    <p className="text-slate-400 font-mono text-xs mt-1">ID: {projectId}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
                        <CheckCircle className="w-3 h-3" /> Operational
                    </span>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={`/dashboard/projects/${projectId}/database`}>
                    <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer group">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-100">Database</h3>
                                    <p className="text-slate-500 text-sm">Manage dynamic tables</p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
                        </CardContent>
                    </Card>
                </Link>

                <Link href={`/dashboard/projects/${projectId}/keys`}>
                    <Card className="bg-slate-900 border-slate-800 hover:border-yellow-500/50 transition-colors cursor-pointer group">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-900/20 rounded-lg text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                    <Key className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-100">API Keys</h3>
                                    <p className="text-slate-500 text-sm">Manage access tokens</p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-yellow-400" />
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Connection Details */}
            <Card className="bg-slate-950/50 border-slate-800">
                <CardHeader>
                    <CardTitle>Connection Details</CardTitle>
                    <CardDescription>Use these details to connect your app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-400">API Endpoint</label>
                        <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-slate-800">
                            <code className="text-blue-400 font-mono text-sm flex-1">http://localhost:4000/v1</code>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
