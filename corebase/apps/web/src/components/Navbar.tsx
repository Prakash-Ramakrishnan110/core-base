"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

import Image from "next/image";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 h-24 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center font-bold tracking-tight text-slate-900">
                    <Image
                        src="/logo.png"
                        alt="CoreBase Logo"
                        width={200}
                        height={80}
                        className="h-20 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/enterprise" className="hover:text-blue-600 transition-colors">Enterprise</Link>
                    <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                    <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
                    <Link href="/#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
                    <Link href="/docs" className="hover:text-blue-600 transition-colors">Docs</Link>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link href="https://github.com/corebase" target="_blank" className="text-slate-500 hover:text-slate-900 hidden sm:block">
                        <Github className="w-5 h-5" />
                    </Link>
                    <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
                    <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Sign In
                    </Link>
                    <Link href="/auth/register">
                        <Button size="sm" className="rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-600/20">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
