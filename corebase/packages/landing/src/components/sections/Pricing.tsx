import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Developer",
        price: "$0",
        description: "Perfect for hobby projects",
        features: ["1 Project", "1k Records", "Basic Support"],
    },
    {
        name: "Pro",
        price: "$29",
        description: "For growing startups",
        features: ["5 Projects", "100k Records", "Audit Logs", "Priority Support"],
        highlight: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scale without limits",
        features: ["Unlimited Projects", "Unlimited Records", "SLA", "Dedicated Support"],
    }
];

export function Pricing() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
                    <p className="text-slate-400">Start for free, scale as you grow.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <Card key={i} className={`relative ${plan.highlight ? 'border-blue-500 bg-slate-900/60 shadow-blue-900/20 shadow-xl scale-105 z-10' : 'bg-slate-900/40'}`}>
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-xs px-3 py-1 rounded-full font-bold">
                                    MOST POPULAR
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <div className="text-4xl font-bold mt-4">{plan.price}<span className="text-lg font-normal text-slate-500">/mo</span></div>
                                <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((f, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                                            <Check className="w-4 h-4 text-green-500" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full" variant={plan.highlight ? 'primary' : 'outline'}>
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
