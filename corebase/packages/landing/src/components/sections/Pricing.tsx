"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Check, Zap } from "lucide-react";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const plans = [
    {
        name: "Developer",
        price: "$0",
        description: "Perfect for hobby projects",
        features: ["1 Project", "1k Records", "Basic Support", "Community Access"],
        cta: "Start for Free",
        highlight: false
    },
    {
        name: "Pro",
        price: "$29",
        description: "For growing startups",
        features: ["5 Projects", "100k Records", "Audit Logs", "Priority Support", "Automated Backups", "Team Collaboration"],
        cta: "Go Pro",
        highlight: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scale without limits",
        features: ["Unlimited Projects", "Unlimited Records", "SLA", "Dedicated Support", "SSO & SAML", "Custom Infrastructure"],
        cta: "Contact Sales",
        highlight: false
    }
];

export function Pricing() {
    return (
        <section className="py-32 relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-20"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">
                        Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">pricing</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-slate-400 max-w-xl mx-auto text-lg">
                        Start for free, scale as you grow. No hidden fees or surprises.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            variants={scaleIn}
                            className={`relative rounded-2xl transition-all duration-300 ${plan.highlight
                                    ? 'bg-slate-900 border border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10'
                                    : 'bg-slate-900/40 border border-white/5 hover:border-white/10'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                                    <Zap className="w-3 h-3 fill-current" /> MOST POPULAR
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-slate-500 ml-1">/mo</span>}
                                </div>
                                <p className="text-slate-400 text-sm mb-8">{plan.description}</p>

                                <Button
                                    className={`w-full h-12 rounded-xl font-medium transition-all ${plan.highlight
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
                                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </div>

                            <div className="border-t border-white/5 p-8 bg-black/20 rounded-b-2xl">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Features</p>
                                <ul className="space-y-4">
                                    {plan.features.map((f, index) => (
                                        <li key={index} className="flex items-center gap-3 text-sm text-slate-300">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-blue-500/20' : 'bg-slate-700/50'}`}>
                                                <Check className={`w-3 h-3 ${plan.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
