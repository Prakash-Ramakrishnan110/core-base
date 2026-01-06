"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ChartProps {
    data: number[];
    color?: string;
    height?: number;
    className?: string;
}

export function MiniChart({ data, color = "#3b82f6", height = 40, className = "" }: ChartProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = useMemo(() => {
        return data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(" ");
    }, [data, min, range]);

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ height }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                {/* Gradient Fill */}
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area */}
                <motion.path
                    initial={{ d: `M 0 100 ${points.split(" ").map(p => `L ${p.split(",")[0]} 100`).join(" ")} Z` }}
                    animate={{ d: `M 0 100 L ${points.split(" ").join(" L ")} L 100 100 Z` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    fill={`url(#gradient-${color})`}
                    stroke="none"
                />

                {/* Line */}
                <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
