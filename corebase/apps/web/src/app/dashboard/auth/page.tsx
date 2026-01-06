"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Trash2, Mail, Calendar } from "lucide-react";

interface UserData {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
}

export default function AuthPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4000/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:4000/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">Authentication</h1>
                    <p className="text-slate-400">Manage your application users.</p>
                </div>
                <div className="text-slate-500 text-sm">
                    Total Users: <span className="text-white font-medium">{users.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="text-slate-500">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No users found.</div>
            ) : (
                <div className="grid gap-4">
                    {users.map((user) => (
                        <Card key={user.id} className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-full">
                                        <User className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg text-slate-200">{user.fullName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
