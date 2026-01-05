"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple client-side auth check
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex">
            <DashboardSidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
