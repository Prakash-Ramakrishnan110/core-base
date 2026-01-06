"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <main className="min-h-screen bg-[#020617] text-slate-50">
            <Navbar />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Let's Talk.
                        </h1>
                        <p className="text-xl text-slate-400">
                            Have questions about pricing, enterprise, or just want to say hi? We're here to help.
                        </p>

                        <div className="space-y-6 pt-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-semibold">Email Us</div>
                                    <div className="text-slate-400">sales@corebase.dev</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-semibold">Live Chat</div>
                                    <div className="text-slate-400">Available Mon-Fri, 9am-5pm EST</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-semibold">HQ</div>
                                    <div className="text-slate-400">San Francisco, CA</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-green-500/10 text-green-400">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold">Message Sent!</h3>
                                <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                                <Button onClick={() => setSent(false)} variant="outline">Send another</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">First Name</label>
                                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3" placeholder="John" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Last Name</label>
                                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3" placeholder="Doe" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Email</label>
                                    <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3" placeholder="john@company.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Message</label>
                                    <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 min-h-[150px]" placeholder="Tell us about your project..." required />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 h-12">
                                    Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
