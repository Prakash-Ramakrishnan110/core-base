"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import Particles from "../ui/particles";
import { fadeInUp, float, glowPulse } from "@/lib/animations";
import Link from "next/link";

export function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative pt-[120px] pb-32 overflow-hidden min-h-screen flex items-center">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#020617] -z-20" />

            {/* Gradient Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full -z-10 animate-blob mix-blend-screen opacity-50" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full -z-10 animate-blob animation-delay-2000 mix-blend-screen opacity-30" />

            {/* Particles */}
            <div className="absolute inset-0 -z-10">
                <Particles className="absolute inset-0" quantity={50} ease={80} color="#ffffff" refresh />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 text-blue-300 text-sm font-medium mb-8 hover:bg-blue-500/10 transition-colors cursor-pointer"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v1.0 Public Beta is Here
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-white"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400">
                                Build your backend
                            </span>
                            <br />
                            <span className="text-gradient">in minutes.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            The open-source Firebase alternative.
                            Instantly get a Postgres database, Auto-generated APIs,
                            Authentication, and Real-time subscriptions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <Link href="/auth/register">
                                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105 active:scale-95">
                                    Start Building for Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="https://github.com/corebase" target="_blank">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                                    View Documentation
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                        >
                            <div className="text-sm font-mono text-slate-500">TRUSTED BY DEVELOPERS AT</div>
                            <div className="flex gap-6">
                                {/* Placeholders for logos */}
                                <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse" />
                                <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse animation-delay-200" />
                                <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse animation-delay-400" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Graphic (Code/Product Sim) */}
                    <div className="flex-1 w-full max-w-2xl lg:max-w-none perspective-1000">
                        <motion.div
                            style={{ y: y1 }}
                            initial={{ opacity: 0, rotateX: 10, rotateY: -10, scale: 0.9 }}
                            animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative rounded-xl border border-slate-700/50 bg-[#0F172A]/90 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-blue-500/30 transition-colors"
                        >
                            {/* Window Controls */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-900/50">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 font-mono">
                                    <Terminal className="w-3 h-3" />
                                    server.ts
                                </div>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                                <div className="flex">
                                    <div className="text-slate-600 select-none mr-4 text-right">
                                        1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10
                                    </div>
                                    <div className="text-slate-300">
                                        <span className="text-purple-400">import</span> <span className="text-yellow-200">CoreBase</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@corebase/sdk'</span>;<br /><br />

                                        <span className="text-slate-500">// Initialize your backend</span><br />
                                        <span className="text-blue-400">const</span> app = <span className="text-yellow-200">new CoreBase</span>({`{`}<br />
                                        &nbsp;&nbsp;apiKey: <span className="text-green-400">"pk_live_..."</span>,<br />
                                        {`}`});<br /><br />

                                        <span className="text-slate-500">// Create a scalable project</span><br />
                                        <span className="text-blue-400">const</span> project = <span className="text-purple-400">await</span> app.projects.<span className="text-blue-300">create</span>({`{`}<br />
                                        &nbsp;&nbsp;name: <span className="text-green-400">"Next Big Thing"</span>,<br />
                                        &nbsp;&nbsp;region: <span className="text-green-400">"us-east-1"</span><br />
                                        {`}`});<br /><br />

                                        <span className="text-purple-400">console</span>.<span className="text-blue-300">log</span>(<span className="text-green-400">"🚀 Ready to scale!"</span>);
                                    </div>
                                </div>
                            </div>

                            {/* Glass overlay effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                            variants={float}
                            animate="animate"
                            className="absolute -right-8 top-10 hidden lg:flex items-center gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-700/50 shadow-2xl backdrop-blur-md z-20"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500 blur opacity-40 animate-pulse" />
                                <div className="relative p-2 bg-slate-800 rounded-lg border border-slate-700">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</div>
                                <div className="text-sm font-bold text-green-400">Operational</div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={float}
                            animate="animate"
                            transition={{ delay: 1 }}
                            className="absolute -left-8 bottom-20 hidden lg:flex flex-col gap-2 p-4 rounded-xl bg-slate-900/90 border border-slate-700/50 shadow-2xl backdrop-blur-md z-20 max-w-[200px]"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div className="text-xs font-bold text-slate-300">Real-time DB</div>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: ["0%", "70%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full bg-blue-500"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Syncing...</span>
                                <span>12ms</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
