"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Code, Terminal } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v1.0 is now public
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-[1.1]">
                            Build apps data <br />
                            <span className="text-blue-500">fast & secure.</span>
                        </h1>

                        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            CoreBase provides the backend infrastructure you need.
                            Authentication, dynamic databases, and real-time audit logs.
                            Open source and self-hostable.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="rounded-full px-8 h-12 text-base bg-blue-600 hover:bg-blue-500 text-white">
                                Get Started <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                View on GitHub
                            </Button>
                        </div>
                    </div>

                    {/* Right Graphic (Code/Product Sim) */}
                    <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative rounded-xl border border-slate-800 bg-[#0F172A] shadow-2xl overflow-hidden"
                        >
                            {/* Window Controls */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-[#1E293B]">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <div className="ml-auto text-xs text-slate-500 font-mono">server.ts</div>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                                <div className="text-purple-400">import</div> <div className="text-slate-100 inline">CoreBase</div> <div className="text-purple-400 inline">from</div> <div className="text-green-400 inline">'@corebase/sdk'</div>;
                                <br /><br />
                                <div className="text-blue-400">const</div> app = <div className="text-yellow-300 inline">new CoreBase</div>({`{`}
                                <div className="pl-4">
                                    apiKey: <div className="text-green-400 inline">"pk_live_..."</div>,
                                    <br />
                                    region: <div className="text-green-400 inline">"us-east-1"</div>
                                </div>
                                {`}`});
                                <br /><br />
                                <div className="text-slate-500">// Create a project seamlessly</div>
                                <br />
                                <div className="text-blue-400">await</div> app.projects.<div className="text-yellow-300 inline">create</div>({`{`}
                                <div className="pl-4">
                                    name: <div className="text-green-400 inline">"My Startup"</div>,
                                    <br />
                                    tier: <div className="text-green-400 inline">"PRO"</div>
                                </div>
                                {`}`});
                                <br /><br />
                                <div className="text-green-400">console</div>.<div className="text-yellow-300 inline">log</div>(<div className="text-green-400 inline">"🚀 Backend ready!"</div>);
                            </div>
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute -right-10 top-20 hidden lg:flex items-center gap-3 p-4 rounded-lg bg-slate-900 border border-slate-800 shadow-xl"
                        >
                            <div className="p-2 bg-green-500/20 rounded-md">
                                <Terminal className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Status</div>
                                <div className="text-sm font-bold text-green-400">Operational</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
