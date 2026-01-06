"use client";

import { Button } from "@/components/ui/button";
import { HardDrive, Plus, Upload, Image as ImageIcon, File as FileIcon, Trash2, Globe, Lock, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { CreateBucketDialog } from "@/components/dashboard/CreateBucketDialog";
import { motion, AnimatePresence } from "framer-motion";

interface Bucket {
    id: string;
    name: string;
    public: boolean;
    created_at: string;
}

interface FileObject {
    id: string;
    name: string;
    bucket_id: string;
    size: number;
    mime_type: string;
    created_at: string;
}

export default function ProjectStoragePage() {
    const params = useParams();
    const projectId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [buckets, setBuckets] = useState<Bucket[]>([]);
    const [files, setFiles] = useState<FileObject[]>([]);

    const [activeBucketId, setActiveBucketId] = useState<string | null>(null);
    const [loadingBuckets, setLoadingBuckets] = useState(true);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch Buckets
    const fetchBuckets = async () => {
        setLoadingBuckets(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/projects/${projectId}/storage/buckets`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBuckets(data);
                if (data.length > 0 && !activeBucketId) {
                    setActiveBucketId(data[0].id);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBuckets(false);
        }
    };

    // Fetch Files when Active Bucket Changes
    useEffect(() => {
        if (projectId) fetchBuckets();
    }, [projectId]);

    const fetchFiles = async () => {
        if (!activeBucketId) return;
        setLoadingFiles(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/storage/buckets/${activeBucketId}/objects`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFiles(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingFiles(false);
        }
    };

    useEffect(() => {
        if (activeBucketId) fetchFiles();
        else setFiles([]);
    }, [activeBucketId]);

    // Handle Upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !activeBucketId) return;

        const file = e.target.files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:4000/storage/buckets/${activeBucketId}/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }, // Content-Type header handled automatically by browser for FormData
                body: formData
            });

            if (res.ok) {
                fetchFiles(); // Refresh list
            } else {
                const err = await res.json();
                alert(err.error || "Upload failed");
            }
        } catch (err) {
            alert("Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const activeBucket = buckets.find(b => b.id === activeBucketId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Storage</h1>
                    <p className="text-slate-400">Store and serve content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchBuckets} className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loadingBuckets ? 'animate-spin' : ''}`} /> Sync
                    </Button>
                    <CreateBucketDialog projectId={projectId} onSuccess={fetchBuckets}>
                        <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                            <Plus className="w-4 h-4 mr-2" /> New Bucket
                        </Button>
                    </CreateBucketDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Buckets List */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Buckets</h3>
                    <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {loadingBuckets && buckets.length === 0 ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                            </div>
                        ) : buckets.length === 0 ? (
                            <div className="px-2 text-sm text-slate-500 italic">No buckets yet.</div>
                        ) : (
                            buckets.map(bucket => (
                                <div
                                    key={bucket.id}
                                    onClick={() => setActiveBucketId(bucket.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${activeBucketId === bucket.id ? "bg-blue-900/20 border border-blue-500/30 text-white" : "hover:bg-slate-800 text-slate-400 border border-transparent"}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <HardDrive className={`w-4 h-4 flex-shrink-0 ${activeBucketId === bucket.id ? "text-blue-400" : "text-slate-500"}`} />
                                        <span className="text-sm font-medium truncate">{bucket.name}</span>
                                    </div>
                                    {bucket.public ? <Globe className="w-3 h-3 text-green-500/70" /> : <Lock className="w-3 h-3 text-amber-500/70" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* File Browser */}
                <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl min-h-[500px] flex flex-col shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="font-medium text-slate-200">{activeBucket?.name || "Select a bucket"}</span>
                            {activeBucket && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeBucket.public ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {activeBucket.public ? 'Public' : 'Private'}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={!activeBucketId || uploading}
                            />
                            <Button
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                                disabled={!activeBucketId || uploading}
                            >
                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                Upload File
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 bg-slate-950/30">
                        {loadingFiles ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <p>Loading objects...</p>
                            </div>
                        ) : !activeBucketId ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <HardDrive className="w-12 h-12 mb-4 opacity-20" />
                                <p>Select a bucket to view files</p>
                            </div>
                        ) : files.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                                <Upload className="w-12 h-12 mb-4 opacity-20" />
                                <p className="mb-4">No files in this bucket.</p>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-slate-700 hover:bg-slate-800">
                                    Upload your first file
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {files.map(file => (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="aspect-square bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-between gap-2 hover:border-blue-500/50 cursor-pointer group transition-all relative overflow-hidden"
                                        onClick={() => window.open(`http://localhost:4000/storage/file/${file.bucket_id}/${file.name}`, '_blank')}
                                    >
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Deletion could go here */}
                                        </div>

                                        <div className={`p-4 rounded-full ${file.mime_type?.startsWith('image') ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'} group-hover:scale-110 transition-transform mb-auto mt-auto`}>
                                            {file.mime_type?.startsWith('image') ? <ImageIcon className="w-8 h-8" /> : <FileIcon className="w-8 h-8" />}
                                        </div>

                                        <div className="text-center w-full bg-slate-950/50 p-2 rounded">
                                            <div className="text-xs font-medium text-slate-300 truncate w-full" title={file.name}>{file.name}</div>
                                            <div className="text-[10px] text-slate-500">{formatSize(file.size)}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
