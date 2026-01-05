import { Card, CardContent } from "../ui/card";

const testimonials = [
    {
        quote: "CoreBase saved us weeks of boilerplate. The dynamic tables are a game changer.",
        author: "Sarah Chen",
        role: "CTO, TechStart",
        avatar: "SC"
    },
    {
        quote: "Finally, a backend service that doesn't lock you in. Self-hosting is seamless.",
        author: "Mark Davis",
        role: "Indie Developer",
        avatar: "MD"
    },
    {
        quote: "The audit logs gave us the compliance tracking we needed for our enterprise clients.",
        author: "Alex Rivera",
        role: "Lead Engineer",
        avatar: "AR"
    }
];

export function Testimonials() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Trusted by Developers</h2>
                    <p className="text-slate-400">Join thousands building on CoreBase.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((t, i) => (
                        <Card key={i} className="bg-slate-900/30 border-slate-800">
                            <CardContent className="pt-6">
                                <p className="text-lg text-slate-300 italic mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{t.author}</div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
