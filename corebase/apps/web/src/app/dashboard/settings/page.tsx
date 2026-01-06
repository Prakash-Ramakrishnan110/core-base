"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Shield, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // In a real app, we'd fetch user profile from an endpoint like /auth/me
        // For now, we decode the token or just show a placeholder since our login didn't return user details to localStorage
        // Let's assume we can fetch project 0 to ensure token validity

        // Mock user data for display since our auth response was flat access token
        setUser({
            fullName: "Developer",
            email: "dev@example.com",
            role: "Owner",
            id: "usr_123456789"
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-slate-400">Manage your account preferences and security.</p>
            </div>

            {/* Profile Section */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        <CardTitle>Profile Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Full Name</label>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                                {user?.fullName || "Loading..."}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Email Address</label>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-500" />
                                {user?.email || "Loading..."}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>Manage your password and active sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800">
                        Change Password
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-500/5 border-red-500/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    </div>
                    <CardDescription className="text-red-500/70">Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-200">Sign Out Everywhere</div>
                        <div className="text-sm text-slate-500">Revoke all active sessions and tokens.</div>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
                </CardContent>
            </Card>
        </div>
    );
}
