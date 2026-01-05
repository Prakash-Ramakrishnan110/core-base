"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Key, Copy, Plus, Trash2, Loader2, Shield, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApiKey {
    id: string;
    key_prefix: string;
    name: string;
    permissions: string[];
    created_at: string;
    last_used_at: string | null;
}

export default function ProjectApiKeysPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [newKey, setNewKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchKeys = async () => {
        setLoading(true);
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
        if (!newKeyName) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/keys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newKeyName })
            });

            if (res.ok) {
                const data = await res.json();
                setNewKey(data.apiKey);
                fetchKeys();
                setShowCreateModal(false);
                setNewKeyName("");
            } else {
                alert("Failed to create API Key");
            }

        } catch (err) {
            alert("Error creating API Key");
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm("Are you sure you want to revoke this API Key? Any applications using it will lose access immediately.")) return;
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1">API Keys</h1>
                    <p className="text-slate-400">Manage authentication tokens for your applications.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                    <Plus className="w-4 h-4 mr-2" /> Create New Key
                </Button>
            </div>

            {/* Success Message (New Key) */}
            <AnimatePresence>
                {newKey && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-green-400">API Key Created Successfully</h3>
                                    <p className="text-green-500/70 text-sm">Please copy this key immediately. You won't be able to see it again.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-black/40 border border-green-500/20 rounded-lg p-3 font-mono text-sm text-green-300 break-all">
                                        {newKey}
                                    </div>
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-500 text-white"
                                        onClick={() => copyToClipboard(newKey)}
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? "Copied" : "Copy Key"}
                                    </Button>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => setNewKey(null)} className="text-slate-400 hover:text-white">
                                        Done
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Modal (Simple Toggle) */}
            {showCreateModal && !newKey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Create New API Key</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Key Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Production Web App"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-200 flex gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                Like a password, keep this key secret. Do not commit it to version control.
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                                <Button onClick={handleCreateKey} disabled={!newKeyName} className="bg-blue-600 hover:bg-blue-500">Create Key</Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Key List */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : keys.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-center">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 text-yellow-400">
                        <Key className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No API keys created</h3>
                    <p className="text-slate-500 mb-6">Create a key to authenticate requests from your client apps.</p>
                    <Button onClick={() => setShowCreateModal(true)} variant="outline">Create Key</Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {keys.map((key) => (
                        <div key={key.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                            <div className="flex items-start gap-4 mb-4 md:mb-0">
                                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-100">{key.name}</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
                                    </div>
                                    <div className="font-mono text-sm text-slate-500 mt-1 flex items-center gap-2">
                                        <span className="text-slate-400">{key.key_prefix}•••••••••••••••••••••</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2">
                                        Created on {new Date(key.created_at).toLocaleDateString()} • {key.last_used_at ? `Last used ${new Date(key.last_used_at).toLocaleDateString()}` : "Never used"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pl-14 md:pl-0">
                                <Button variant="outline" size="sm" className="hidden md:flex border-slate-700 text-slate-300 hover:text-white bg-transparent">
                                    <Shield className="w-3 h-3 mr-2" /> Permissions
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-950/30 hover:text-red-300 border border-transparent hover:border-red-900/30"
                                    onClick={() => handleRevokeKey(key.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Revoke
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
