import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-slate-400 hover:text-white -ml-4">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold text-white">CoreBase Documentation</h1>
                <p className="text-xl text-slate-400">Everything you need to build your backend.</p>

                <div className="space-y-6">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-blue-400">Getting Started</h2>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg space-y-4">
                            <h3 className="font-bold">1. Authentication</h3>
                            <p className="text-slate-400">CoreBase uses JWT authentication. Send the token in the header:</p>
                            <pre className="bg-black p-4 rounded text-sm font-mono text-green-400">
                                Authorization: Bearer &lt;your_token&gt;
                            </pre>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-blue-400">API Reference</h2>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                            <ul className="space-y-2 list-disc list-inside text-slate-300">
                                <li><strong>POST /tables</strong> - Create a dynamic table</li>
                                <li><strong>POST /tables/:name/records</strong> - Add data</li>
                                <li><strong>GET /api-keys</strong> - Manage access keys</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
