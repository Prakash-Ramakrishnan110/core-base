"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <span className="font-mono">CB</span>
                    </div>
                    CoreBase
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <Link href="/enterprise" className="hover:text-white transition-colors">Enterprise</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link href="https://github.com/corebase" target="_blank" className="text-slate-400 hover:text-white hidden sm:block">
                        <Github className="w-5 h-5" />
                    </Link>
                    <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
                    <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white">
                        Sign In
                    </Link>
                    <Link href="/auth/register">
                        <Button size="sm" className="rounded-full px-4 bg-blue-600 hover:bg-blue-500 text-white border-0">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
