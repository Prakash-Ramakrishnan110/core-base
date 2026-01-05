"use client";

import { Button } from "@/components/ui/button";
import { HardDrive, Plus, Upload, Image as ImageIcon, File as FileIcon, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProjectStoragePage() {
    const [buckets, setBuckets] = useState([
        { id: "avatars", name: "avatars", public: true },
        { id: "documents", name: "documents", public: false },
    ]);
    const [activeBucketId, setActiveBucketId] = useState("avatars");
    const [files, setFiles] = useState([
        { id: "1", name: "profile_pic.png", size: "1.2 MB", type: "image", bucketId: "avatars" },
        { id: "2", name: "data.json", size: "14 KB", type: "file", bucketId: "avatars" },
    ]);

    const handleCreateBucket = () => {
        const name = prompt("Bucket Name:");
        if (name) {
            const id = name.toLowerCase().replace(/\s+/g, "-");
            setBuckets([...buckets, { id, name, public: false }]);
            setActiveBucketId(id);
        }
    }

    const handleDeleteBucket = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this bucket?")) {
            setBuckets(buckets.filter(b => b.id !== id));
            if (activeBucketId === id) setActiveBucketId(buckets[0]?.id || "");
        }
    }

    const handleUpload = () => {
        alert("File upload simulation: Success! (This is a demo)");
        setFiles([...files, {
            id: Date.now().toString(),
            name: `upload_${Date.now()}.png`,
            size: "2.5 MB",
            type: "image",
            bucketId: activeBucketId
        }]);
    }

    const activeFiles = files.filter(f => f.bucketId === activeBucketId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Storage</h1>
                    <p className="text-slate-400">Store and serve content.</p>
                </div>
                <Button onClick={handleCreateBucket} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                    <Plus className="w-4 h-4 mr-2" /> New Bucket
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Buckets</h3>
                    <div className="space-y-1">
                        {buckets.map(bucket => (
                            <div
                                key={bucket.id}
                                onClick={() => setActiveBucketId(bucket.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group ${activeBucketId === bucket.id ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <HardDrive className={`w-4 h-4 ${activeBucketId === bucket.id ? "text-blue-400" : "text-slate-500"}`} />
                                    <span className="text-sm font-medium">{bucket.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400" onClick={(e) => handleDeleteBucket(bucket.id, e)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="hover:text-white cursor-pointer">{buckets.find(b => b.id === activeBucketId)?.name || "Select a bucket"}</span>
                            <span>/</span>
                        </div>
                        <Button size="sm" onClick={handleUpload} className="bg-blue-600 hover:bg-blue-500 text-white" disabled={!activeBucketId}>
                            <Upload className="w-4 h-4 mr-2" /> Upload File
                        </Button>
                    </div>

                    <div className="flex-1 p-6">
                        {activeFiles.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <p>No files in this bucket.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {activeFiles.map(file => (
                                    <div key={file.id} className="aspect-square bg-slate-950/50 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 cursor-pointer group transition-all">
                                        <div className={`p-3 rounded-lg ${file.type === 'image' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'} group-hover:scale-110 transition-transform`}>
                                            {file.type === 'image' ? <ImageIcon className="w-8 h-8" /> : <FileIcon className="w-8 h-8" />}
                                        </div>
                                        <div className="text-center w-full">
                                            <div className="text-sm font-medium text-slate-300 truncate w-full">{file.name}</div>
                                            <div className="text-xs text-slate-500">{file.size}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
