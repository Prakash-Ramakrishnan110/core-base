import { Navbar } from "@/components/Navbar";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 relative selection:bg-blue-500/30">

      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-grid-pattern -z-10" />
        <Hero />
      </div>

      <div className="relative z-10 bg-[#020617]">
        <HowItWorks />
        <div id="features"><Features /></div>
        <Testimonials />
        <div id="pricing"><Pricing /></div>
        <FAQ />
        <CTA />
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#020617] text-center">
        <div className="container mx-auto px-4 text-slate-500 text-sm">
          <p className="mb-4">&copy; 2026 CoreBase. Open Source Backend as a Service.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-slate-300">GitHub</a>
            <a href="#" className="hover:text-slate-300">Twitter</a>
            <a href="#" className="hover:text-slate-300">Discord</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
