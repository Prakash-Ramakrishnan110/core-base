"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Invalid credentials');

            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                router.push('/dashboard');
            } else {
                throw new Error("No token received");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900 overflow-hidden">

            {/* Left: Login Form */}
            <div className="flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-4">
                            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                                <img src="/logo.png" alt="CoreBase Logo" className="w-64 h-auto object-contain" />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Welcome back</h1>
                        <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            <Github className="mr-2 w-4 h-4" /> Github
                        </Button>
                        <Button variant="outline" className="w-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            <span className="mr-2 font-bold text-lg">G</span> Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-500/30" disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: Feature Showcase */}
            <div className="hidden lg:flex flex-col justify-center p-12 relative bg-slate-50 border-l border-slate-200">
                <div className="absolute inset-0">
                    <Particles className="absolute inset-0" quantity={40} staticity={30} color="#3b82f6" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10 max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-4xl font-bold mb-6 text-slate-900">Scale faster with <br /><span className="text-blue-600">CoreBase</span></h2>

                    <div className="space-y-6">
                        {[
                            "Instant PostgreSQL Database",
                            "Auto-generated REST APIs",
                            "Role-based Access Control",
                            "Real-time Subscriptions"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 text-slate-600">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                </div>
                                <span className="text-lg">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-white/80 rounded-xl border border-slate-200 backdrop-blur-md shadow-sm">
                        <div className="flex gap-4 items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200" />
                            <div>
                                <div className="font-bold text-slate-900">Alex Chen</div>
                                <div className="text-xs text-slate-500">CTO at TechFlow</div>
                            </div>
                        </div>
                        <p className="text-slate-600 italic">"CoreBase saved us months of backend development time. It's the most developer-friendly BaaS we've used."</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
