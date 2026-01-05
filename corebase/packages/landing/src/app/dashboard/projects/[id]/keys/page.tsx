"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Key, Copy, Plus, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ApiKey {
    id: string;
    key_prefix: string;
    name: string;
    created_at: string;
    last_used_at: string | null;
}

export default function ProjectApiKeysPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKey, setNewKey] = useState<string | null>(null);

    const fetchKeys = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/keys`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setKeys(data.keys || []);
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
        if (projectId) fetchKeys();
    }, [projectId]);

    const handleCreateKey = async () => {
        const name = prompt("Enter key description (e.g. Production Key):");
        if (!name) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/keys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                const data = await res.json();
                setNewKey(data.apiKey); // Backend returns { apiKey: "..." }
                fetchKeys();
            } else {
                alert("Failed to create API Key");
            }

        } catch (err) {
            alert("Error creating API Key");
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm("Revoke this API Key? It will stop working immediately.")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/projects/${projectId}/keys/${keyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchKeys();
        } catch (err) {
            alert("Error revoking key");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">API Keys</h1>
                    <p className="text-slate-400">Manage access tokens for Project: {projectId.slice(0, 8)}...</p>
                </div>
                <Button onClick={handleCreateKey} className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Plus className="w-4 h-4" /> Create New Key
                </Button>
            </div>

            {newKey && (
                <Card className="bg-green-500/10 border-green-500/20 p-4 mb-6">
                    <h3 className="text-green-400 font-bold mb-2">Key Created Successfully</h3>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded border border-green-500/10">
                        <code className="flex-1 font-mono text-sm text-green-300 overflow-hidden">{newKey}</code>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:text-green-300" onClick={() => navigator.clipboard.writeText(newKey)}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-green-500/70 mt-2">Save this key now. You won't see it again.</p>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : keys.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No API keys found for this project.</div>
            ) : (
                <div className="grid gap-4">
                    {keys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Key className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-200">{key.name}</h3>
                                    <div className="font-mono text-xs text-slate-500 mt-1">
                                        Prefix: <span className="text-slate-400">{key.key_prefix}</span> • Created: {new Date(key.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400" onClick={() => handleRevokeKey(key.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
