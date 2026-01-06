"use client";

import { Button } from "@/components/ui/button";
import { Zap, Plus, Code, Play } from "lucide-react";
import { useState } from "react";

export default function ProjectFunctionsPage() {
    const [functions, setFunctions] = useState([
        { id: "1", name: "hello-world", status: "deployed", version: "v2.1" }
    ]);

    const handleCreateFunction = () => {
        const name = prompt("Function Name:");
        if (name) {
            setFunctions([...functions, { id: Date.now().toString(), name, status: "building", version: "v0.1" }]);
            setTimeout(() => {
                setFunctions(prev => prev.map(f => f.name === name ? { ...f, status: "deployed" } : f));
            }, 2000);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Edge Functions</h1>
                    <p className="text-slate-400">Deploy serverless code to the edge.</p>
                </div>
                <Button onClick={handleCreateFunction} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                    <Plus className="w-4 h-4 mr-2" /> New Function
                </Button>
            </div>

            <div className="grid gap-4">
                {functions.map(func => (
                    <div key={func.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg">{func.name}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                <div className="flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${func.status === 'deployed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                                    <span className="capitalize">{func.status}</span>
                                </div>
                                <div className="font-mono text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                    GET /functions/v1/{func.name}
                                </div>
                                <div>Latest: <span className="text-white">{func.version}</span></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                                <Code className="w-4 h-4 mr-2" /> Editor
                            </Button>
                            <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                                <Play className="w-4 h-4 mr-2" /> Test
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-indigo-500/20 rounded-xl p-8 text-center dashed-border">
                    <div className="inline-flex p-3 rounded-full bg-indigo-500/10 mb-4 text-indigo-400">
                        <Code className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Deploy your first function</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Write TypeScript code and deploy it instantly.
                    </p>
                    <Button variant="outline" onClick={handleCreateFunction} className="border-indigo-500/50 text-indigo-300 hover:text-white hover:bg-indigo-500/10">
                        Create Function
                    </Button>
                </div>
            </div>
        </div>
    );
}
