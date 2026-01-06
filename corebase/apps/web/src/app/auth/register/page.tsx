"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch('http://localhost:4000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Registration failed');
            }

            // Auto login or redirect to login? Redirect for now to verify email flow if implemented later
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900">

            {/* Left: Register Form */}
            <div className="flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-4">
                            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                                <img src="/logo.png" alt="CoreBase Logo" className="w-64 h-auto object-contain" />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Create an account</h1>
                        <p className="text-slate-500">Start building your next big idea today.</p>
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

                    <form onSubmit={handleRegister} className="space-y-4">
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
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-slate-500">Must be at least 6 characters.</p>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-500/30" disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
                    </p>

                    <div className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex flex-col justify-center p-12 relative bg-slate-50 border-l border-slate-200">
                <div className="absolute inset-0">
                    <Particles className="absolute inset-0" quantity={40} staticity={30} color="#3b82f6" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-purple-50/50 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10 max-w-lg mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-8 shadow-sm border border-slate-100 ring-4 ring-slate-50">
                        <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-3xl absolute opacity-20" />
                        <div className="relative text-8xl">🚀</div>
                    </div>

                    <h2 className="text-4xl font-bold mb-6 text-slate-900">Launch within minutes</h2>
                    <p className="text-xl text-slate-600 mb-8">
                        Join thousands of developers building the future of web applications with CoreBase.
                    </p>
                </div>
            </div>

        </div>
    );
}
