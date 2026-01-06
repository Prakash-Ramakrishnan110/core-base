"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Save, Trash2, Command } from "lucide-react";

export default function SqlEditorPage() {
    const params = useParams();
    const projectId = params.id as string;

    const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    const handleRun = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/sql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ query })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Execution failed");
            }
            setResult(data);
            if (!history.includes(query)) {
                setHistory(prev => [query, ...prev].slice(0, 10)); // Keep last 10
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleRun();
        }
    };

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">SQL Editor</h1>
                    <p className="text-slate-400 text-sm">Run raw SQL queries against your database.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleRun} disabled={loading} className="bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        Run
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Editor Section */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
                        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 px-4">
                            <span>SQL Query</span>
                            <span className="flex items-center gap-1"><Command className="w-3 h-3" /> + Enter to run</span>
                        </div>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 w-full bg-slate-950 p-4 font-mono text-sm text-blue-300 outline-none resize-none leading-relaxed"
                            placeholder="SELECT * FROM ..."
                            spellCheck={false}
                        />
                    </div>

                    {/* Result Interface */}
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-0 shadow-lg">
                        <div className="bg-slate-950 p-2 border-b border-slate-800 px-4 flex justify-between items-center h-10">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Results</span>
                            {result && <span className="text-xs text-slate-500">{result.rowCount} rows • {result.duration}ms</span>}
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar p-0 relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="p-6 text-red-400 font-mono text-sm whitespace-pre-wrap">
                                    {error}
                                </div>
                            ) : !result ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                        <Play className="w-6 h-6 ml-1" />
                                    </div>
                                    <p>Run a query to see results</p>
                                </div>
                            ) : result.rows.length === 0 ? (
                                <div className="p-6 text-slate-500 italic">Query executed successfully. No rows returned.</div>
                            ) : (
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10">
                                        <tr>
                                            {Object.keys(result.rows[0]).map((key) => (
                                                <th key={key} className="px-4 py-3 font-medium border-b border-slate-800 whitespace-nowrap">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {result.rows.map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-800/50 group">
                                                {Object.values(row).map((val: any, j: number) => (
                                                    <td key={j} className="px-4 py-2 text-slate-300 font-mono text-xs whitespace-nowrap max-w-[200px] truncate" title={String(val)}>
                                                        {val === null ? <span className="text-slate-600 italic">null</span> : String(val)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (History/Tables) */}
                <div className="hidden lg:flex flex-col gap-4 min-h-0">
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-slate-800 font-medium text-sm text-slate-300">Query History</div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-xs text-slate-500 p-2 text-center">No history yet</p>
                            ) : (
                                history.map((h, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setQuery(h)}
                                        className="p-3 rounded bg-slate-800/50 hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-700 transition-colors group relative"
                                    >
                                        <div className="text-xs font-mono text-slate-400 line-clamp-3 group-hover:text-blue-300">{h}</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setHistory(history.filter((_, idx) => idx !== i)); }}
                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
