import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, Shield, Server, Globe } from "lucide-react";
import Link from "next/link";

export default function EnterprisePage() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                        <Shield className="w-4 h-4" /> Enterprise Grade Security
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                        Run CoreBase on<br />Your Own Infrastructure
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Get the power of CoreBase compliant with SOC2, heavily hardened, and deployed inside your VPC.
                        Total data sovereignty.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Link href="/contact">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 h-12 px-8">
                                Contact Sales
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8 border-slate-700 text-slate-300 hover:bg-slate-800">
                            View Documentation
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
                            <Server className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">On-Premise Deployment</h3>
                            <p className="text-slate-400">Deploy CoreBase via Docker or Kubernetes directly into your private AWS/GCP/Azure setup.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
                            <Shield className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">SSO & SAML</h3>
                            <p className="text-slate-400">Integrate with Okta, Auth0, or Active Directory for workforce identity management.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
                            <Globe className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Global Edge Network</h3>
                            <p className="text-slate-400">Optimized routing and read-replicas for sub-50ms latency worldwide.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-20 text-center">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-8">Trusted by Engineering Teams At</h3>
                <div className="flex justify-center flex-wrap gap-12 grayscale opacity-50">
                    {/* Mock Logos */}
                    <div className="text-2xl font-bold text-white">ACME Corp</div>
                    <div className="text-2xl font-bold text-white">GlobalBank</div>
                    <div className="text-2xl font-bold text-white">TechFlow</div>
                    <div className="text-2xl font-bold text-white">DataSys</div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 bg-[#020617] text-center">
                <div className="container mx-auto px-4 text-slate-500 text-sm">
                    <p>&copy; 2026 CoreBase Enterprise.</p>
                </div>
            </footer>
        </main>
    );
}
