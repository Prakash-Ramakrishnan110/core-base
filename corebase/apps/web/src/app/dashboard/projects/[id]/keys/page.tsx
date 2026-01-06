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

    const [defaultKeys, setDefaultKeys] = useState<{ anon?: string; service?: string; jwtSecret?: string } | null>(null);
    const [showServiceKey, setShowServiceKey] = useState(false);
    const [showJwtSecret, setShowJwtSecret] = useState(false);

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
                setDefaultKeys(data.defaultKeys || null);
            } else if (res.status === 401) {
                router.push("/auth/login");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of useEffect and handlers unchanged until return)

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">API Keys</h1>
                    <p className="text-slate-500">Manage your project's API keys and JWT authentication.</p>
                </div>
            </div>

            {/* Default Keys Section (Supabase Style) */}
            {defaultKeys && (
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Anon Key */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">anon</h3>
                                    <p className="text-xs text-slate-500 font-mono">public</p>
                                </div>
                                <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200">PUBLIC</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-2">This key depends on your Policies (Postgres RLS). It is safe to use in browsers.</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-600 truncate">
                                    {defaultKeys.anon}
                                </div>
                                <Button size="sm" variant="outline" onClick={() => copyToClipboard(defaultKeys.anon || "")}>
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Service Key */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">service_role</h3>
                                    <p className="text-xs text-slate-500 font-mono">secret</p>
                                </div>
                                <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">SECRET</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-2">This key attempts to bypass Policies. NEVER use it in browsers.</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-600 truncate">
                                    {showServiceKey ? defaultKeys.service : "•".repeat(45)}
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setShowServiceKey(!showServiceKey)}>
                                    {showServiceKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => copyToClipboard(defaultKeys.service || "")}>
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* JWT Secret */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-white">JWT Secret</h3>
                                <p className="text-xs text-slate-400">Used to sign tokens</p>
                            </div>
                            <Shield className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-black/30 border border-slate-700 rounded-lg p-2 font-mono text-xs text-slate-300 truncate">
                                {showJwtSecret ? defaultKeys.jwtSecret : "•".repeat(60)}
                            </div>
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setShowJwtSecret(!showJwtSecret)}>
                                {showJwtSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:text-white" onClick={() => copyToClipboard(defaultKeys.jwtSecret || "")}>
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-10 border-t border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Additional API Keys</h2>
                <Button onClick={() => setShowCreateModal(true)} className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50">
                    <Plus className="w-4 h-4 mr-2" /> Create New Key
                </Button>
            </div>

            {/* Success Message (New Key) - Unchanged */}
            <AnimatePresence>
                {newKey && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-6 overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-green-700">API Key Created Successfully</h3>
                                    <p className="text-green-600/80 text-sm">Please copy this key immediately. You won't be able to see it again.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white border border-green-200 rounded-lg p-3 font-mono text-sm text-green-700 break-all shadow-sm">
                                        {newKey}
                                    </div>
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => copyToClipboard(newKey)}
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? "Copied" : "Copy Key"}
                                    </Button>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => setNewKey(null)} className="text-slate-500 hover:text-slate-900">
                                        Done
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Modal - Unchanged */}
            {showCreateModal && !newKey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Create New API Key</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Key Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Production Web App"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 flex gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                                Like a password, keep this key secret. Do not commit it to version control.
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-slate-900">Cancel</Button>
                                <Button onClick={handleCreateKey} disabled={!newKeyName} className="bg-blue-600 hover:bg-blue-700 text-white">Create Key</Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Key List - Unchanged but wrapped */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : keys.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-200 shadow-sm">
                        <Key className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No additional API keys</h3>
                    <p className="text-slate-500 mb-6 text-sm">Create a key to authenticate requests from unique clients.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {keys.map((key) => (
                        <div key={key.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all shadow-sm">
                            <div className="flex items-start gap-4 mb-4 md:mb-0">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-900">{key.name}</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">Active</span>
                                    </div>
                                    <div className="font-mono text-sm text-slate-500 mt-1 flex items-center gap-2">
                                        <span className="text-slate-400">{key.key_prefix}•••••••••••••••••••••</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Created on {new Date(key.created_at).toLocaleDateString()} • {key.last_used_at ? `Last used ${new Date(key.last_used_at).toLocaleDateString()}` : "Never used"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pl-14 md:pl-0">
                                <Button variant="outline" size="sm" className="hidden md:flex border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50">
                                    <Shield className="w-3 h-3 mr-2" /> Permissions
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100"
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
