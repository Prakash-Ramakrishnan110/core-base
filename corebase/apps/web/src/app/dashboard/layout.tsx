"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { ChatWidget } from "@/components/dashboard/ChatWidget";
import { motion } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Simple client-side auth check
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        } else {
            setLoading(false);
        }

        // Listen for sidebar collapse (optional, or use context)
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
            else setIsSidebarCollapsed(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col transition-all duration-300 ml-[80px] lg:ml-[280px]">
                <DashboardNavbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
            <ChatWidget />
        </div>
    );
}
