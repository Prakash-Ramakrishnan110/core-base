"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm CoreBot. I can help you with Database, Auth, Storage, and Deployment.",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const findResponse = (input: string) => {
        const lower = input.toLowerCase();

        if (lower.includes("price") || lower.includes("billing") || lower.includes("check plan")) return "We offer a generous Free Tier (500MB DB, 1GB Storage) and a Pro Plan ($29/mo) for scaling teams. Check the Billing tab.";
        if (lower.includes("delete") && lower.includes("project")) return "To delete a project, go to the project's Settings tab, scroll down to the 'Danger Zone', and click Delete. You'll need to confirm by typing 'DELETE'.";
        if (lower.includes("create") && lower.includes("project")) return "Click the 'New Project' button on the main dashboard. You'll need to provide a name and optional description.";
        if (lower.includes("database") || lower.includes("table")) return "Our database is built on Postgres. You can create tables visually in the Database tab or use our SQL editor.";
        if (lower.includes("auth") || lower.includes("login") || lower.includes("user")) return "CoreBase Auth supports Email/Password, Google, and GitHub providers. Manage users in the Auth & Users tab.";
        if (lower.includes("storage") || lower.includes("bucket") || lower.includes("upload")) return "CoreBase Storage handles files. Create buckets (public/private) in the Storage tab to start uploading images/videos.";
        if (lower.includes("function") || lower.includes("deploy") || lower.includes("edge")) return "Deploy serverless functions with zero config. Use our online editor in the Functions tab or our CLI tool.";
        if (lower.includes("api key") || lower.includes("secret")) return "Your project's API Keys (Public and Secret) are in the API Keys tab. Keep your Secret Key safe!";
        if (lower.includes("hello") || lower.includes("hi")) return "Hello there! How can I help you build today?";

        return "I'm not sure about that specific detail yet. Try asking about 'Database', 'Storage', 'Auth', or 'Pricing'.";
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Processing time based on query length
        setTimeout(() => {
            const responseText = findResponse(userMsg.content);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">CoreBot AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-slate-400 uppercase font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.role === "user" ? "ml-auto" : "mr-auto"
                                    )}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Sparkles className="w-4 h-4 text-blue-400" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3 max-w-[85%] mr-auto">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75" />
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/50 border-t border-slate-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about Database, Auth..."
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 text-sm"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute right-1 top-1 h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white"
                                    disabled={!inputValue.trim() || isTyping}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 transition-colors",
                    isOpen ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-gradient-to-tr from-blue-600 to-purple-600 text-white"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-950 rounded-full animate-ping" />
                )}
            </motion.button>
        </>
    );
}
