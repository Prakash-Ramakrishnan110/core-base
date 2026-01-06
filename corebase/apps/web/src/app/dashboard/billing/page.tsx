"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Zap } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Billing & Usage</h1>
                <p className="text-slate-500">Manage your subscription and view usage limits.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Current Plan</h3>
                    <div className="flex items-end gap-2 mb-6">
                        <div className="text-4xl font-bold text-slate-900">Free</div>
                        <div className="text-slate-500 mb-1">/ forever</div>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500" /> 3 Projects
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500" /> 100 MB Database
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500" /> Community Support
                        </li>
                    </ul>
                    <Button variant="outline" className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900">Manage Subscription</Button>
                </div>

                {/* Upgrade Promo */}
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 border border-blue-500/30 rounded-xl p-6 overflow-hidden text-white shadow-lg shadow-blue-500/20">
                    <div className="absolute top-0 right-0 p-3">
                        <Zap className="w-16 h-16 text-white/10 rotate-12" />
                    </div>
                    <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wider mb-4">Upgrade to Pro</h3>
                    <div className="flex items-end gap-2 mb-6">
                        <div className="text-4xl font-bold text-white">$29</div>
                        <div className="text-blue-100 mb-1">/ month</div>
                    </div>
                    <p className="text-blue-50 mb-8 text-sm leading-relaxed">
                        Unlock unlimited projects, 10GB storage, priority support, and team collaboration features.
                    </p>
                    <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold border-none shadow-md">
                        Upgrade Now
                    </Button>
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Invoice History</h3>
                <div className="text-center py-8 text-slate-400 text-sm">
                    No invoices found.
                </div>
            </div>
        </div>
    );
}
