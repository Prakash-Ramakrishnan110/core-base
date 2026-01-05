"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Search, Filter, Mail, Calendar, Shield, MoreVertical, Plus, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react";

interface AuthUser {
    id: string;
    email: string;
    provider: "email" | "google" | "github";
    created_at: string;
    last_sign_in: string | null;
    status: "active" | "banned";
    role: "user" | "admin";
}

export default function ProjectAuthPage() {
    const { id } = useParams();
    const projectId = id as string;
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Mock Data
        setTimeout(() => {
            setUsers([
                { id: "usr_1", email: "alice@example.com", provider: "email", created_at: new Date().toISOString(), last_sign_in: new Date().toISOString(), status: "active", role: "user" },
                { id: "usr_2", email: "bob@gmail.com", provider: "google", created_at: new Date(Date.now() - 86400000).toISOString(), last_sign_in: null, status: "active", role: "user" },
                { id: "usr_3", email: "charlie@github.com", provider: "github", created_at: new Date(Date.now() - 172800000).toISOString(), last_sign_in: new Date(Date.now() - 100000).toISOString(), status: "banned", role: "user" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const handleAddUser = () => {
        const email = prompt("User Email:");
        if (email) {
            const newUser: AuthUser = {
                id: `usr_${Date.now()}`,
                email,
                provider: "email",
                created_at: new Date().toISOString(),
                last_sign_in: null,
                status: "active",
                role: "user"
            };
            setUsers([newUser, ...users]);
        }
    }

    const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Authentication</h1>
                    <p className="text-slate-400">Manage your application's users and access policies.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300">
                        Providers
                    </Button>
                    <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4 mr-2" /> Add User
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><User className="w-6 h-6" /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-medium uppercase">Total Users</div>
                        <div className="text-2xl font-bold text-white">{users.length}</div>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><CheckCircle className="w-6 h-6" /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-medium uppercase">Active Now</div>
                        <div className="text-2xl font-bold text-white">1</div>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-lg text-red-400"><Ban className="w-6 h-6" /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-medium uppercase">Banned</div>
                        <div className="text-2xl font-bold text-white">0</div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <Search className="w-4 h-4 text-slate-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search users by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none text-sm text-white focus:ring-0 flex-1 placeholder:text-slate-600 outline-none"
                />
                <div className="w-px h-6 bg-slate-800" />
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Filter className="w-3 h-3 mr-2" /> Filter
                </Button>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded bg-slate-800 border-slate-700" /></th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Provider</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4">Last Sign In</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4"><input type="checkbox" className="rounded bg-slate-800 border-slate-700" /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.email}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
                                                {user.provider}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {user.last_sign_in ? new Date(user.last_sign_in).toLocaleString() : "Never"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status === "active" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    Banned
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
