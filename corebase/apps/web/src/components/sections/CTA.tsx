import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-blue-600/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/20 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to ship faster?
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                    Stop building the same auth and database logic for every project.
                    Start with CoreBase today.
                </p>

                <div className="flex justify-center gap-4">
                    <Link href="/auth/register">
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-blue-500/50 shadow-2xl">
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
