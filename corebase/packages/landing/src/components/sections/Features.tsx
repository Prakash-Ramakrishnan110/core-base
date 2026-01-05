import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Database, Key, Lock, Layout, Moon, CloudLightning } from "lucide-react";

const features = [
    {
        title: "Dynamic Tables",
        description: "Create and manage custom data schemas on the fly without writing SQL.",
        icon: Database,
    },
    {
        title: "Authentication",
        description: "Secure user registration, login, and session management powered by JWT.",
        icon: Lock,
    },
    {
        title: "API Keys",
        description: "Issue hashed API keys for programmatic access with granular permissions.",
        icon: Key,
    },
    {
        title: "Audit Logs",
        description: "Track every critical action in your system for compliance and security.",
        icon: Layout,
    },
    {
        title: "Dark Mode First",
        description: "Designed for developers with a sleek, eye-saving dark theme.",
        icon: Moon,
    },
    {
        title: "High Performance",
        description: "Built on Fastify and PostgreSQL for lightning-fast response times.",
        icon: CloudLightning,
    },
];

export function Features() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        CoreBase comes packed with the essential building blocks for modern SaaS applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:border-blue-500/50 transition-colors bg-slate-900/40">
                            <CardHeader>
                                <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-400">
                                {feature.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
