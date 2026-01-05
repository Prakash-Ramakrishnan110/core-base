"use client";

import { motion } from "framer-motion";
import { Database, Key, Lock, Layout, Moon, CloudLightning, Shield, Globe, Zap } from "lucide-react";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const features = [
    {
        title: "Dynamic Tables",
        description: "Create and manage custom data schemas on the fly without writing SQL. Changes propagate instantly.",
        icon: Database,
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        title: "Authentication",
        description: "Secure user registration, login, and session management powered by JWT and secure cookies.",
        icon: Lock,
        color: "text-green-400",
        bg: "bg-green-500/10"
    },
    {
        title: "API Keys",
        description: "Issue hashed API keys for programmatic access with granular permissions and usage tracking.",
        icon: Key,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10"
    },
    {
        title: "Audit Logs",
        description: "Track every critical action in your system for compliance, security, and debugging.",
        icon: Layout,
        color: "text-purple-400",
        bg: "bg-purple-500/10"
    },
    {
        title: "Real-time Sync",
        description: "Subscribe to database changes and sync your UI in real-time with WebSockets.",
        icon: Zap,
        color: "text-orange-400",
        bg: "bg-orange-500/10"
    },
    {
        title: "Edge Ready",
        description: "Built on Fastify and PostgreSQL for lightning-fast response times globally.",
        icon: Globe,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10"
    },
];

export function Features() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full -z-10 translate-y-[-50%]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full -z-10" />

            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-20"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">build faster</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-slate-400 max-w-2xl mx-auto text-lg">
                        CoreBase comes packed with the essential building blocks for modern SaaS applications.
                        Stop reinventing the wheel.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ y: -5 }}
                            className="group relative p-8 rounded-2xl glass-card transition-all duration-300"
                        >
                            {/* Hover Gradient Border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                            <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-blue-200 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
