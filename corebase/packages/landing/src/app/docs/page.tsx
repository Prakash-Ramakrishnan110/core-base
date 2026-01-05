"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, Terminal, Database, Key, Shield } from "lucide-react";
import { useState } from "react";

export default function DocsPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    }

    const CodeBlock = ({ code, id, label }: { code: string, id: string, label?: string }) => (
        <div className="relative group rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
            {label && <div className="bg-slate-900/50 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800">{label}</div>}
            <pre className="p-4 text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre custom-scrollbar">
                {code}
            </pre>
            <button
                onClick={() => copyToClipboard(code, id)}
                className="absolute top-2 right-2 p-2 rounded bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all"
            >
                {copied === id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <span className="font-mono">CB</span>
                        </div>
                        CoreBase Docs
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                            <ArrowLeft className="mr-2 w-4 h-4" /> Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar Navigation */}
                <aside className="hidden lg:block space-y-8 sticky top-32 self-start h-fit">
                    <div>
                        <h3 className="font-bold text-white mb-4">Getting Started</h3>
                        <ul className="space-y-2 text-sm border-l border-slate-800 pl-4">
                            <li><a href="#quickstart" className="text-blue-400 hover:text-blue-300 block">Quick Start</a></li>
                            <li><a href="#auth" className="text-slate-400 hover:text-white block">Authentication</a></li>
                            <li><a href="#database" className="text-slate-400 hover:text-white block">Database & Tables</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">API Reference</h3>
                        <ul className="space-y-2 text-sm border-l border-slate-800 pl-4">
                            <li><a href="#rest-api" className="text-slate-400 hover:text-white block">REST API</a></li>
                            <li><a href="#sdk" className="text-slate-400 hover:text-white block">JavaScript SDK</a></li>
                        </ul>
                    </div>
                </aside>

                {/* Content */}
                <div className="lg:col-span-3 space-y-12">

                    {/* Quick Start */}
                    <section id="quickstart" className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-4">How to use CoreBase</h1>
                            <p className="text-lg text-slate-400">
                                CoreBase is a Backend-as-a-Service (BaaS) that provides you with a Postgres database, authentication, file storage, and edge functions out of the box.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <div className="p-3 bg-blue-500/10 w-fit rounded-lg text-blue-400 mb-4"><Shield className="w-6 h-6" /></div>
                                <h3 className="font-bold text-white mb-2">1. Create Account</h3>
                                <p className="text-sm text-slate-400">Sign up and create your first project in the dashboard.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <div className="p-3 bg-purple-500/10 w-fit rounded-lg text-purple-400 mb-4"><Database className="w-6 h-6" /></div>
                                <h3 className="font-bold text-white mb-2">2. Define Schema</h3>
                                <p className="text-sm text-slate-400">Create tables (e.g. 'users', 'posts') using the UI Grid.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <div className="p-3 bg-yellow-500/10 w-fit rounded-lg text-yellow-400 mb-4"><Key className="w-6 h-6" /></div>
                                <h3 className="font-bold text-white mb-2">3. Connect App</h3>
                                <p className="text-sm text-slate-400">Use your API Key to fetch and write data from your frontend.</p>
                            </div>
                        </div>
                    </section>

                    {/* Authentication */}
                    <section id="auth" className="space-y-6 pt-8 border-t border-slate-800">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Shield className="w-5 h-5" /></span>
                            Authentication
                        </h2>
                        <p className="text-slate-400">
                            CoreBase handles user sessions for you. To make authenticated requests, include the <code className="bg-slate-800 px-1 py-0.5 rounded text-white text-xs">Authorization</code> header.
                        </p>

                        <CodeBlock
                            id="auth-header"
                            label="HTTP Header"
                            code={`Authorization: Bearer <YOUR_API_KEY>`}
                        />
                    </section>

                    {/* Database Usage */}
                    <section id="database" className="space-y-6 pt-8 border-t border-slate-800">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Database className="w-5 h-5" /></span>
                            Database Usage
                        </h2>
                        <p className="text-slate-400">
                            You can interact with your database using simple REST endpoints.
                        </p>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-white">Fetch Data (GET)</h3>
                            <CodeBlock
                                id="fetch-code"
                                label="JavaScript (Fetch)"
                                code={`// 1. Fetch all posts
const response = await fetch('http://localhost:4000/v1/projects/PROJ_ID/database/posts', {
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
    }
});

const { data } = await response.json();
console.log(data); // Array of posts`}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-white">Insert Data (POST)</h3>
                            <CodeBlock
                                id="post-code"
                                label="JavaScript (Fetch)"
                                code={`// 2. Create a new post
await fetch('http://localhost:4000/v1/projects/PROJ_ID/database/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
        title: 'Hello CoreBase',
        content: 'This is my first post!'
    })
});`}
                            />
                        </div>
                    </section>

                    {/* SDK Promo */}
                    <section id="sdk" className="p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl text-center">
                        <Terminal className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Prefer a typed SDK?</h2>
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Install our TypeScript client for full type safety and autocompletion.
                        </p>
                        <div className="flex justify-center gap-4">
                            <CodeBlock id="npm-install" code="npm install @corebase/js" />
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
