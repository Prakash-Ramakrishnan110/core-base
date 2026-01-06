"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        q: "Can I self-host CoreBase?",
        a: "Absolutely! CoreBase is open-source and comes with a Docker Compose setup that runs anywhere."
    },
    {
        q: "Is it really free?",
        a: "The self-hosted version is 100% free and open source. We only charge for managed cloud hosting."
    },
    {
        q: "What database does it use?",
        a: "We use PostgreSQL 16 under the hood. You get full access to the database if you need it."
    },
    {
        q: "How secure is it?",
        a: "Very. We use bcrypt for passwords, JWTs for sessions, and SHA-256 for API keys. Audit logs track all sensitive actions."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-slate-900/10">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-slate-800 rounded-lg bg-slate-900/40 overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-slate-800/50 transition-colors"
                            >
                                {faq.q}
                                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 text-slate-400 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
