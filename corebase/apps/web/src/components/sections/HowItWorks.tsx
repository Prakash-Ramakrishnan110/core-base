import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, Code, Database, Globe } from "lucide-react";

const steps = [
    {
        title: "1. Define Schema",
        description: "Create your data model visually. We instantly provision Postgres tables for you.",
        icon: Database,
    },
    {
        title: "2. Generate API",
        description: "Review your auto-generated REST API endpoints. Secure them with API keys.",
        icon: Code,
    },
    {
        title: "3. Build Frontend",
        description: "Connect your favorite frontend framework (React, Vue, etc.) to your new backend.",
        icon: Globe,
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-slate-900/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How it works</h2>
                    <p className="text-slate-400">From idea to production in minutes.</p>
                </div>

                <div className="relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 -z-10" />

                    {steps.map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl shadow-black/50 group-hover:border-blue-500/50 transition-colors z-10">
                                <step.icon className="w-10 h-10 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-slate-400 text-sm max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
